
import pandas as pd
import numpy as np
from model import *
from utils import *
from global_functions import *




def prepare_for_D3(sample, bins_centred, change_row, change_vector, anchors, percent, names, apply_monot, monot_array):
    data = []
    
    no_features = sample.shape[0]
    
    if (monot_array is None or monot_array == []):
        monot_array = np.ones(no_features)


    for i in range(bins_centred.shape[0]):
        result = {}
        result["name"] = names[i]
        
        if len(names[i]) > 20:
            result["short_name"] = names[i][:20] + "..."
        else:
            result["short_name"] = names[i]
        
        if (change_vector is not None):
            result["incr"] = int(abs(change_vector[i]))
        else:
            result["incr"] = 0 
        
        if (percent > 0.5):
            result["dir"] = 1
        else:
            result["dir"] = 0
        
        if (anchors is not None):
            if (anchors[i] == 1):
                result["anch"] = 1
            else:
                result["anch"] = 0
        else:
            result["anch"] = 0
        
        val = sample[i].round(0)
    
        if (change_row is None):
            change = val
        else:
            change = change_row[i].round(0)
        
        max_bin = np.max(bins_centred[i])
        min_bin = np.min(bins_centred[i])
        
        if (min_bin == -1):
            min_bin = 0

        if (max_bin < 10):
            max_bin = 10
        
        scl_val = (val-min_bin)/(max_bin-min_bin)
        scl_change = (change-min_bin)/(max_bin-min_bin)

        if (scl_val < 0 ):
            scl_val = 0
        if (scl_change < 0):
            scl_change = 0
        if (scl_val > 1 ):
            scl_val = 1
        if (scl_change > 1):
            scl_change = 1

        if (apply_monot and monot_array[i] == 0):
            result["val"] = int(val)
            result["scl_val"] = 1-float(scl_val)
            result["change"] = int(change)
            result["scl_change"] = 1-float(scl_change)

        else:
            result["val"] = int(val)
            result["scl_val"] = float(scl_val)
            result["change"] = int(change)
            result["scl_change"] = float(scl_change)

        data.append(result)
        
    return data



def prep_for_D3_aggregation(pre_proc_file,all_data_file,samples,bins_centred,positions,transform,sort = False):

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

	# return final_data
	final_data = np.array(final_data)
	# return(final_data.tolist())
	
	# -- Sorting based on the number of arrows -- 
	if sort == True:
		count_list = np.zeros((final_data.shape[1],))
		for c in range(final_data.shape[1]):
			col = final_data[:,c]
			count = 0
			for sample in col:
				if sample['scl_val'] != sample['scl_change']:
					count += 1

			count_list[c] = count

		keySort = np.argsort(count_list)[::-1]

		final_result = np.array([])

		for key in keySort:
			if final_result.any() == False:
				final_result = final_data[:,key].reshape(-1,1)
			else:
				final_result = np.append(final_result,final_data[:,key].reshape(-1,1), axis = 1)

		return final_result.tolist()
	
	else:
		return final_data.tolist()

