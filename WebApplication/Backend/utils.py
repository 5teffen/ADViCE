import numpy as np
import pandas as pd
from sklearn.neighbors.kde import KernelDensity
from sklearn import preprocessing
from operator import itemgetter
import copy


def model_overview(pre_proc_file):
	pre_data = pd.read_csv(pre_proc_file).values

	total_count = pre_data.shape[0]
	
	changes_count = 0
	key_count = 0

	tp_count = 0
	fp_count = 0

	tn_count = 0
	fn_count = 0

	for sample in pre_data:

		if sample[2]== "TP":
			tp_count += 1

		elif sample[2]== "FP":
			fp_count += 1
 
		elif sample[2] == "TN":
			tn_count += 1

		elif sample[2] == "FN":
			fn_count += 1


		if sample[3] > 0:
			key_count += 1

		if sample[4] > 0:
			changes_count += 1


	# print("-- Model Summary --")

	# print("Total # of samples:", total_count)
	# print()
	# print("True Positive:",tp_count)
	# print("False Positive:",fp_count)
	# print("True Negative:",tn_count)
	# print("False Negative:",fn_count)
	# print()
	# print("Key Features:",key_count)
	# print("Changes",changes_count)


def display_data (sample):
	sample -= 1
	if X[sample][0] == -9:
		category = "NA"
		return sample, 0, 0, category, -1
	else:
		good_percent = svm_model.run_model(X[sample])
		predicted = 0
		if good_percent>.5:
			predicted = 1
		ground_truth = y[sample]
		model_correct = 1
		if predicted != ground_truth:
			model_correct = 0
		category = "NN";
		if (predicted, model_correct) == (0,0):
			category = "FN"
		elif (predicted, model_correct) == (0,1):
			category = "TN"
		elif (predicted, model_correct) == (1,0):
			category = "FP"
		elif (predicted, model_correct) == (1,1):
			category = "TP"
		return sample, good_percent, model_correct, category, predicted



def separate_bins_feature(feat_column, no_bins):

	# -- All other cases --
	feat_column = feat_column.flatten()
	two_std = 2*np.std(feat_column)
	avg_val = np.mean(feat_column)

	# -- Finding the Range --
	if (avg_val - two_std < 0):
		min_val = 0
	else:
		min_val = round((avg_val - two_std),0)
	max_val = round((avg_val + two_std),0)

	# -- Creating the Bins --
	single_bin = (max_val - min_val) // no_bins
	if (single_bin == 0):
		single_bin = 1
	
	centre = min_val + (single_bin // 2)
	floor = min_val
	ceil = min_val + single_bin

	ranges = []
	bins = np.zeros(no_bins)
	new_col = np.zeros(feat_column.shape[0])
	new_col_vals = np.zeros(feat_column.shape[0])

	for i in range(no_bins):
		range_str = ""
		if (centre <= max_val):
			for val_i in range(feat_column.shape[0]):
					if (i == 0):
						range_str = "x < " + str(ceil)
						if (feat_column[val_i] < ceil):
							new_col[val_i] = i
							new_col_vals[val_i] = centre

					elif (i == no_bins-1) or ((centre + single_bin) > max_val):
						range_str = str(floor) + " < x"
						if (feat_column[val_i] >= floor):
							new_col[val_i] = i
							new_col_vals[val_i] = centre

					else:
						range_str = str(floor) +" < x < " + str(ceil)
						if ((ceil > feat_column[val_i]) and (feat_column[val_i] >= floor)):
							new_col[val_i] = i
							new_col_vals[val_i] = centre
			bins[i] = centre
			ranges.append(range_str)
		
		else:
			bins[i] = -1
			ranges.append("-1")


		floor += single_bin
		ceil += single_bin
		centre += single_bin

	return bins, new_col, new_col_vals, ranges

def divide_data_bins(data,no_bins):
    no_feat = data.shape[1]
    bins_centred = []
    X_pos_array = []
    in_vals = []
    
    for i in range(no_feat):
        # Handles special case
        bins, new_col, val, col_range = separate_bins_feature(data[:,i].flatten(),no_bins)
        
        in_vals.append(val)
        bins_centred.append(bins)
        X_pos_array.append(new_col)
        
    # Convert to numpy array
    in_vals = np.array(in_vals).transpose()
    bins_centred = np.array(bins_centred)
    X_pos_array = (np.array(X_pos_array)).transpose() 

    return bins_centred, X_pos_array, in_vals

def prepare_for_analysis(filename):
	data_array = pd.read_csv(filename,header=None).values

	# -- Removes the columns with all -9 values -- 
	row_no = 0 
	for row in data_array:
		for col_i in range(1,row.shape[0]):
			if (row[col_i] == -9):
				remove = True
			else:
				remove = False
				break

		if remove:
			data_array = np.delete(data_array, row_no, 0)

		else:
			row_no += 1

	return data_array


def sort_by_val(main, density):
    ordered_main = []
    ordered_density = []

    ordered_main = sorted(main, key=itemgetter('scl_val'), reverse=True) 
    keySort = sorted(range(len(main)), key = lambda k: main[k]["scl_val"], reverse=True)

    for key in keySort:
        ordered_density.append(density[key])

    return ordered_main, ordered_density







if __name__ == '__main__':
    vals = pd.read_csv("static/data/final_data_file.csv", header=None).values
    X = vals[:,1:]
    y = vals[:,0]

    vals_no_9 = prepare_for_analysis("static/data/final_data_file.csv")
    X_no_9 = vals_no_9[:,1:]

    no_samples, no_features = X.shape


    bins_centred, X_pos_array, init_vals = divide_data_bins(X_no_9,[9,10])
    # density_array = scaling_data_density(X_no_9, bins_centred)
    # print(len(density_array))

    proj_samples = [x+1 for x in range(1000)]

    trans = sample_transf(X)

    # prep_for_D3_aggregation("static/data/pred_data_x.csv","static/data/final_data_file.csv", proj_samples, bins_centred, X_pos_array, trans, True)
    # result = populate_violin_plot(X_pos_array, np.array([1,2,3,4,5,6,7]),trans)

    # all_den, select_den, all_median , select_median = kernel_density(X_no_9, [1,2,3,4,5],trans)   # Density Code!!
    all_den, all_median, all_mean = all_kernel_densities(X_no_9)
    select_den, select_median, select_mean = specific_kernel_densities(X_no_9, [1,2,3,4,5],trans)

    # count_total = occurance_counter("static/data/pred_data_x.csv")
    # sample_transf()


