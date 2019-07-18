import pandas as pd
import numpy as np
from Functions import *


def prep_for_D3_aggregation(pre_proc_file,all_data_file,samples,bins_centred,positions,transform):

	names = ["External Risk Estimate", 
                      "Months Since Oldest Trade Open",
                      "Months Since Last Trade Open",
                      "Average Months in File",
                      "Satisfactory Trades",
                      "Trades 60+ Ever",
                      "Trades 90+ Ever",
                      "% Trades Never Delq.",
                      "Months Since Last Delq.",
                      "Max Delq. Last 12M",
                      "Max Delq. Ever",
                      "Total Trades",
                      "Trades Open Last 12M",
                      "% Installment Trades",
                      "Months Since Most Recent Inq",
                      "Inq Last 6 Months",
                      "Inq Last 6 Months exl. 7 days",
                      "Revolving Burden",
                      "Installment Burden",
                      "Revolving Trades w/ Balance:",
                      "Installment Trades w/ Balance",
                      "Bank Trades w/ High Utilization Ratio",
                      "% Trades w/ Balance"]
                      
	pre_data = pd.read_csv(pre_proc_file).values
	all_data = pd.read_csv(all_data_file,header=None).values[:,1:]

	final_data = []

	# -- Selected sample id list --

	for s in samples:

		s -= 1
		single_dict_list = []
		for i in range(all_data.shape[1]):
			result = {}
			result["name"] = names[i]
			result["incr"] = 0 

			if pre_data[s][1] > 0.5:
				result["dec"] = 1
			else:
				result["dec"] = 0

			val = all_data[s][i].round(0)
			change = val

	        # -- Identify Anchors --
			for an in range(5,9):
				col = pre_data[s][an]
				if (i == col):
					result["anch"] = 1

			# -- Find Change -- 
			for a in range(9,14):
				col = pre_data[s][a]
				if (i == col):

					new_sample_ind = int(transform[str(s)])
					idx = positions[new_sample_ind][col]
					increments = pre_data[s][a+5]
					change = bins_centred[i][int(idx+increments)]



			max_bin = np.max(bins_centred[i])
			min_bin = np.min(bins_centred[i])

			if (min_bin == -1):
				min_bin = 0

			if (max_bin < 10):
				max_bin = 10

			scl_val = ((val-min_bin)/(max_bin-min_bin)).round(2)
			scl_change = ((change-min_bin)/(max_bin-min_bin)).round(2)

			if (scl_val < 0 ):
				scl_val = 0
			if (scl_change < 0):
				scl_change = 0

			result["scl_val"] = float(scl_val)
			result["scl_change"] = float(scl_change)

			single_dict_list.append(result)
			
		final_data.append(single_dict_list)

	return final_data



if __name__ == '__main__':
	vals = pd.read_csv("static/data/final_data_file.csv", header=None).values
	X = vals[:,1:]
	y = vals[:,0]

	vals_no_9 = prepare_for_analysis("static/data/final_data_file.csv")
	X_no_9 = vals_no_9[:,1:]

	no_samples, no_features = X.shape


	bins_centred, X_pos_array, init_vals = divide_data_bins(X_no_9,[9,10])

	trans_dict = sample_transf(X)

	id_list = [1,2,3,4,5,6,7,8]

	test = prep_for_D3_aggregation("static/data/pred_data_x.csv","static/data/final_data_file.csv", id_list, bins_centred, X_pos_array, trans_dict)

	print(test[0])





