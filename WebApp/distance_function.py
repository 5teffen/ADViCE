import pandas as pd
import numpy as np
from SVM_model import SVM_model
from Functions import *
from Text_Explanation import *
from ILE import *


# vals = pd.read_csv("static/data/final_data_file.csv", header=None).values
# X = vals[:,1:]
# y = vals[:,0]

# vals_no_9 = prepare_for_analysis("static/data/final_data_file.csv")
# X_no_9 = vals_no_9[:,1:]

# no_samples, no_features = X.shape

# svm_model = SVM_model(None,"static/data/final_data_file.csv")
# svm_model.train_model(0.001)
# svm_model.test_model()

# bins_centred, X_pos_array, init_vals = divide_data_bins(X_no_9,[9,10])
# dict_array_orig = scaling_data_density(X_no_9, bins_centred, False)
# dict_array_monot = scaling_data_density(X_no_9, bins_centred, True)
# count_total = occurance_counter("static/data/pred_data_x.csv")



def detect_similarities(pre_data_file):

	pre_data = pd.read_csv(pre_data_file).values
	all_data = pd.read_csv(all_data_file,header=None).values

	X = all_data[:,1:]
	y = all_data[:,0]

	no_samp = X.shape[0]
	no_feat = X.shape[1]

	empty_row = np.zeros(1,no_feat)
	print(empty_row)

	if (changed_row is None):
		return []

	else:
		original = changed_row
	
	return
 
    # for sample_id in range(all_data.shape[0]):

    #     test_sample = all_data[sample_id][1:]
        
    #     fail_count = 0
        
    #     for col in range(original.shape[0]):  
    #         test_val = test_sample[col]
    #         uncertainty = 1.2*(bins[col][2]-bins[col][1])

    #         bottom_thresh = original[col]-uncertainty
    #         top_thresh = original[col]+uncertainty

    #         if (test_val > top_thresh or test_val < bottom_thresh):
    #             fail_count += 1;

    #     if (fail_count <= 2):
    #         if np.round(percent,0) != np.round(pre_data[sample_id][1]):
    #             similar_rows.append(sample_id+1)
