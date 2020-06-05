import numpy as np
import pandas as pd
from sklearn.neighbors.kde import KernelDensity
from sklearn import preprocessing
from operator import itemgetter
import copy

class dataset():

	def __init__ (self, name, lock):
		self.name = name
		self.lock = lock


def apply_sort(sl, complete_data): # Apply sort list (sl) to complete data input
	new_complete = copy.deepcopy(complete_data)

	for s in range(len(complete_data)):
		data_set = complete_data[s]
		new_complete[s]["data"] = np.array(new_complete[s]["data"])
		
		for i in range(len(sl)):
			idx = sl[i]

			# -- Metadata -- 
			new_meta = data_set["meta"][idx]
			new_complete[s]["meta"][i] = new_meta
			
			# -- Median -- 
			new_med = data_set["median"][idx]
			new_complete[s]["median"][i] = new_med

			# -- Histo -- 
			new_hist = data_set["den"][idx]
			new_complete[s]["den"][i] = new_hist

			# -- Aggregation --
			new_aggr = np.array(data_set["data"])[:,int(idx)]
			new_complete[s]["data"][:,i] = new_aggr
		
		new_complete[s]["data"] = (new_complete[s]["data"]).tolist()

	return new_complete



def sort_by_med(medians1, medians2): # Sort aggregation by divergence of medians
	diff_lst = []
	idx_lst = []

	print("MEDIAN 1:" , np.around(medians1,2))
	print("MEDIAN 2:" , np.around(medians2,2))

	for i in range(len(medians1)):
		diff_lst.append(-1*abs(medians2[i] - medians1[i]))
		idx_lst.append(i)

	print("Difference:", np.around(diff_lst,2))
	sort_lst = [1*idx_lst for _,idx_lst in sorted(zip(diff_lst,idx_lst))]
	print("Sort list:", sort_lst)
	return sort_lst

def sort_by_cf(): # Sort aggregation by number of counter factuals
	pass

def mono_finder(model,data, ranges):
	"""
	Assumes linearity. 
	Potentially can be used for weighted monotonicity
	"""
	np.random.seed(5)
	
	no_ft = data.shape[1]

	monotonicity_arr = np.zeros(no_ft)

	sample_no = np.random.randint(0,data.shape[0])
	test_sample = data[sample_no]

	for ft in range(no_ft):
		sample_low = copy.deepcopy(test_sample) 
		sample_high = copy.deepcopy(test_sample) 
		
		min_val, max_val  = find_feature_range(ranges[ft])

		sample_low[ft] = min_val
		sample_high[ft] = max_val

		model_low = model.run_model(sample_low)
		model_high = model.run_model(sample_high)

		if model_high > model_low:
			monotonicity_arr[ft] = 1

		else:
			monotonicity_arr[ft] = -1

	return monotonicity_arr


def find_feature_range(feat_range):
	min_val = feat_range[0][0]
	max_val = 0  
	for i in range(len(feat_range)):  # Finding the max range value
		if (i == len(feat_range)-1):
			max_val = feat_range[i][1]

		elif (feat_range[i+1] == '-1'):
			max_val = feat_range[i][1]
			break
	return (min_val,max_val)


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


def display_data (X,y,model,sample,row=0):
	# Data point not in original dataset
	if sample == -1:
		good_percent = model.run_model(row)
		predicted = 0
		if good_percent>.5:
			predicted = 1
		category = "NN";

		# Need to handle new case for unseen data!
		model_correct = -1
		return sample, good_percent, model_correct, category, predicted

	# Data point in original dataset	
	if X[sample][0] == -9:
		category = "NA"
		return sample, 0, 0, category, -1
	else:
		good_percent = model.run_model(X[sample])
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
	str_ranges = []
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
			str_ranges.append(range_str)
			ranges.append((floor,ceil))
		
		else:
			bins[i] = -1
			str_ranges.append("-1")
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
    col_ranges = []
    
    for i in range(no_feat):
        # Handles special case
        bins, new_col, val, col_range = separate_bins_feature(data[:,i].flatten(),no_bins)
        
        in_vals.append(val)
        bins_centred.append(bins)
        X_pos_array.append(new_col)
        col_ranges.append(col_range)
        
    # Convert to numpy array
    in_vals = np.array(in_vals).transpose()
    bins_centred = np.array(bins_centred)
    X_pos_array = (np.array(X_pos_array)).transpose()
    col_ranges = np.array(col_ranges)

    return bins_centred, X_pos_array, in_vals, col_ranges


def bin_single_sample(sample, col_ranges):
	# -- Extract Basic Parameters -- 
	no_features = len(sample)
	no_bins = len(col_ranges[0])
	pos_array = np.ones(no_features)*-1


	for col_i in range(no_features):
		value = sample[col_i]
		ranges = col_ranges[col_i]

		for bin_no in range(no_bins):
			floor = ranges[bin_no][0]
			ceil = ranges[bin_no][1]
			# -- Dealing with edge cases -- 


			if bin_no == no_bins-1:
				pos_array[col_i] = bin_no
				break

			elif ranges[bin_no + 1] == '-1':
				# if value >= floor:
				pos_array[col_i] = bin_no
				break

			elif bin_no == 0:
				if value <= floor:
					pos_array[col_i] = bin_no
					break

			else:
				if (value < ceil) and (value >= floor):
					pos_array[col_i] = bin_no
					break


	return pos_array


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


def sort_by_imp(main, density, ft_imps):
	ordered_main = []
	ordered_density = []
	abs_ft_imp = np.abs(ft_imps)

	keySort = np.flip(np.argsort(abs_ft_imp))
	for key in keySort:
		ordered_density.append(density[key])
		ordered_main.append(main[key])

	return ordered_main, ordered_density


def test_match(idx, p):
	# -- Testing to match new individual binning --
	idx-=1
	test_sample = data[idx]
	single_bin_result = bin_single_sample(test_sample, col_ranges)
	if p:
		print(data[idx])
		print(svm_model.X[idx])
		print(single_bin_result)
		print(X_pos_array[idx])
	t = (single_bin_result == X_pos_array[idx]).all()
	if not t:
		print(idx+1, "no match")
	return 

def ids_with_combination(pre_proc_file, cols_lst, anchs = False):
	# --- Finds all the combinations with the desired columns --- 

	# --- Hardcoded Parameters --- 
	no_vertical_movement = 5
	no_lateral_movement = 5
	anch_iterations = 4

	pre_data = pd.read_csv(pre_proc_file, index_col=False).values

	all_combinations = {}

	samples_list = []

	# -- Loop through all points -- 
	for sample in range(pre_data.shape[0]):

		cur_lst = []

		# -- Determines if working with changes or anchs
		if (anchs):
			range_val = range(5,5+anch_iterations)
		
		else:
			range_val = range(5+anch_iterations,5+anch_iterations+no_lateral_movement)
		

		for c in range_val:
			val = pre_data[sample][c]
			if (val < 0 or len(cur_lst) > no_lateral_movement):
				break
			cur_lst.append(val)

		# -- Checks if it fulfills the condition -- 
		if (set(cols_lst).issubset(set(cur_lst))):
			samples_list.append(pre_data[sample][0])

	return samples_list








