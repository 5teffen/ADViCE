# --- Instance Level Explanation --- 

import pandas as pd
import numpy as np
from model import *
from utils import *
from global_functions import *
from d3_functions import *


def evaluate_data_set(data):
    no_features = data.shape[1]
    avg_list = []
    std_list = []
    for i in range(no_features):
        current_col = data[:,i].flatten()
        std_list.append(np.std(current_col))
        avg_list.append(np.mean(current_col))
          
    return avg_list, std_list

def perturb_special(min_val,max_val,avg,std,no_val):
    new_col = np.random.normal(avg, std, no_val)
    # Note: these functions have poor time complexity
    np.place(new_col,new_col < min_val, min_val)
    np.place(new_col,new_col > max_val, max_val)
    new_col = new_col.round(0)
    return new_col
    
def find_anchors(model, data_set, sample, no_val, special_cols = []):
    # Special Cols account for the categorical columns

    # --- Hardcoded Parameters --- 
    iterations = 4   # Iterations allowed
    
    # --- Manually --- 
    lowest_category = 0
    highest_category = 7

    
    features = sample.shape[0]
    avg_list, std_list = evaluate_data_set(data_set)

    # Precision Treshold
    treshold = 0.95
    
    # Identify original result from sample
    initial_percentage = model.run_model(sample)
    decision = np.round(initial_percentage,0)

    # Create empty mask 
    mask = np.zeros(features)
    
    # Allows tracking the path
    locked = []


    while (iterations > 0):
        # Retains best result and the corresponding index
        max_ind = (0,0)

        # Assign column that is being tested
        for test_col in range(features):
            new_data = np.empty([features, no_val])

            # Perturb data
            for ind in range(features):
                if (ind == test_col) or (ind in locked):
                    new_data[ind] = np.array(np.repeat(sample[ind],no_val))
                else:
                    if (ind in special_cols):

                        new_data[ind] = perturb_special(lowest_category,highest_category,avg_list[ind],std_list[ind],no_val)
                    else:
                        new_data[ind] = np.random.normal(avg_list[ind], std_list[ind], no_val)

            
            new_data = new_data.transpose()


            # Run Model 
            pred = model.run_model_data(new_data)
            acc = (np.mean(pred == decision))
            
            if (acc > max_ind[0]):
                max_ind = (acc,test_col)
                

        locked.append(max_ind[1])
            
        for n in locked:
            mask[n] = 1
            
        if (max_ind[0] >= treshold):
            return mask
        iterations -= 1
        
    print("!!! No anchors found !!!")
    return None

def perturb_row_feature(model, row, row_idx, feat_idx, current_bins, X_bin_pos, mean_bins, mono_arr, improve, no_bins):
    
    monot_arr = np.copy(mono_arr)                        
    
    c_current_bins = np.copy(current_bins)
    direction = monot_arr[feat_idx]
    current_bin = np.copy(c_current_bins[feat_idx])
    
    if current_bin != no_bins-1:
        next_value = mean_bins[feat_idx][int(current_bin+1)]
    if current_bin < no_bins-2:
        n_next_value = mean_bins[feat_idx][int(current_bin+2)]
    if current_bin != 0:
        prev_value = mean_bins[feat_idx][int(X_bin_pos[row_idx][feat_idx]-1)]
    
    # Set direction for boundary cases
    if direction == -1:
        if current_bin == 0:
            direction = 1
        elif current_bin == no_bins-1 or next_value == -1:
            direction = 0

    # Check if in boundary and return the same row
    if direction == 1:
        if current_bin == no_bins-1 or next_value == -1:
            return (row, c_current_bins)
    elif direction == 0 and current_bin ==  0:
            return (row, c_current_bins)


    # Does not allow for changes into or from last bin (outliers of more than 2 std devs)
    if direction == 1 and current_bin == no_bins-2:
        return (row, c_current_bins)
    elif direction == 1 and n_next_value == -1:
        return (row, c_current_bins)
    if direction == 0 and current_bin == no_bins-1:
        return (row, c_current_bins)
    elif direction == 0 and next_value == -1:
        return (row, c_current_bins)

    
    # Decide direction in special case
    if direction == -1:
        row_up = np.copy(row)
        row_down = np.copy(row)
        row_up[feat_idx] = next_value
        row_down[feat_idx] = prev_value
        percent_1 = model.run_model(row_up)
        percent_0 = model.run_model(row_down)
        if percent_1 >= percent_0:
            if improve:
                c_current_bins[feat_idx] += 1
                return (row_up, c_current_bins)
            else:
                c_current_bins[feat_idx] -= 1
                return (row_down, c_current_bins)
        elif not improve:
            c_current_bins[feat_idx] -= 1
            return (row_down, c_current_bins)
        else:
            c_current_bins[feat_idx] += 1
            return (row_up, c_current_bins)
        
    else:
        p_row = np.copy(row)
        if direction == 1:
            c_current_bins[feat_idx] += 1
            p_row[feat_idx] = next_value
        elif direction == 0:
            c_current_bins[feat_idx] -= 1
            p_row[feat_idx] = prev_value
        
        return (p_row, c_current_bins)
      
def percent_cond (improve, percent):
    if improve and percent <= 0.5:
        return True
    elif (not improve) and percent > 0.5:
        return True
    else:
        return False
    
def find_MSC (model, data, k_row, row_idx, X_bin_pos, mean_bins, no_bins, monotonicity_arr = []):

    # --- Hardcoded Parameters --- 
    no_vertical_movement = 5
    no_lateral_movement = 5


    no_features = k_row.shape[0]

    row = np.copy(k_row)
    percent = model.run_model(row)
    features_moved = np.zeros(no_features)
    times_moved = np.zeros(no_features)
    change_vector = np.zeros(no_features)
    
    original_bins = np.copy(X_bin_pos[row_idx])
    current_bins = np.copy(X_bin_pos[row_idx])
    
    # --- Decides class to attempt to change into ---
    improve = True
    if percent >= .5:
        improve = False
        

    """
    --- Monotonisity needs to be manually imputed ---
    1: Move up to to improve
    0: Move down to improve
    -1: Needs check

    """
    if monotonicity_arr == []:
        monotonicity_arr = np.ones(no_features)


    monotonicity_arr_c = np.copy(monotonicity_arr)
    if not improve:
        for i in range(len(monotonicity_arr)):
            if monotonicity_arr[i] == 1:
                monotonicity_arr_c[i] = 0
            elif monotonicity_arr[i] == 0:
                monotonicity_arr_c[i] = 1
    monotonicity_arr = np.copy(monotonicity_arr_c)
    
    while percent_cond(improve, percent) and (features_moved == 1).sum() < no_lateral_movement and max(times_moved) < no_vertical_movement:
        new_percents = []
        pert_rows = []
        new_curr_bins = []
        
        # Avoids moving ExternalScore
        for i in range(1,len(row)):
            t_row, t_current_bins = perturb_row_feature(model, row, row_idx, i, current_bins, X_bin_pos, mean_bins, monotonicity_arr, improve, no_bins)
            pert_rows.append(t_row)
            new_curr_bins.append(t_current_bins)
            new_percents.append(model.run_model(t_row))

        new_percents = np.array(new_percents)
        
        if improve:
            idx = np.argmax(new_percents)
        else:
            idx = np.argmin(new_percents)
        
        row = pert_rows[idx]
        percent = new_percents[idx]
        current_bins = new_curr_bins[idx]

        features_moved[idx] = 1
        times_moved[idx] += 1
    
    for l in range(no_features):
        change_vector[l] = current_bins[l] - original_bins[l]
        
    if not percent_cond(improve, percent):
        return change_vector, row
    else:
        print("Decision can't be moved within thresholds:")
        return None,None

def instance_explanation(model, data, k_row, row_idx, X_bin_pos, mean_bins, no_bins, mono_arr):
    
    initial_percentage = model.run_model(k_row)

    change_vector, change_row = find_MSC(model, data, k_row, row_idx, X_bin_pos, mean_bins, no_bins, mono_arr)
    anchors = find_anchors(model, data, k_row, 100)

    return change_vector, change_row, anchors, initial_percentage



    return trans_dict

def detect_similarities(pre_data_file, all_data_file, sample_vec, changed_row, bins, percent):
    # --- Runs only if changes occur --- 

    """
    Criteria:
    - Decision is flipped
    - Range: +/- 1.2 single bin
    - Variations Allowed: 2

    """

    pre_data = pd.read_csv(pre_data_file).values
    all_data = pd.read_csv(all_data_file,header=None).values

    similar_rows = []

    if (changed_row is None):
        return []

    else:
        original = changed_row


    for sample_id in range(all_data.shape[0]):

        test_sample = all_data[sample_id][1:]
        
        fail_count = 0
        
        for col in range(original.shape[0]):  
            test_val = test_sample[col]
            uncertainty = 1.2*(bins[col][2]-bins[col][1])

            bottom_thresh = original[col]-uncertainty
            top_thresh = original[col]+uncertainty

            if (test_val > top_thresh or test_val < bottom_thresh):
                fail_count += 1;

        if (fail_count <= 2):
            if np.round(percent,0) != np.round(pre_data[sample_id][1]):
                similar_rows.append(sample_id+1)

    return similar_rows


if __name__ == '__main__':

    from preprocessing import create_summary_file


    # --- Setting random seed -- 
    np.random.seed(150)

    # --- Parameters --- 
    data_path = "diabetes.csv"
    no_bins = 10
    preproc_path = "test.csv"
    model_path = "TBD"   # Manual? 


    # --- Advanced Parameters
    density_fineness = 1000
    categorical_cols = []  # Categorical columns can be customized
    monotonicity_arr = []


    df = pd.read_csv(data_path)
    feature_names = np.array(df.columns)[:-1]
    all_data = np.array(df.values)

    # -- Split data and target values --
    data = all_data[:,:-1]
    target = all_data[:,-1]

    no_samples, no_features = data.shape

    svm_model = SVM_model(data,target)
    svm_model.train_model(0.001)
    svm_model.test_model()

    bins_centred, X_pos_array, init_vals = divide_data_bins(data,no_bins)  # Note: Does not account for categorical features

    density_fineness = 1000
    all_den, all_median, all_mean = all_kernel_densities(data,feature_names,density_fineness) # Pre-load density distributions


    sample_no = 1

    change_vector, change_row, anchors, percent = instance_explanation(svm_model, data, data[sample_no], sample_no, X_pos_array, bins_centred, 
                                                        no_bins, monotonicity_arr)



    # create_summary_file(data, target, svm_model, bins_centred, X_pos_array, init_vals, no_bins, monotonicity_arr, preproc_path)
    res = prepare_for_D3(data[sample_no], bins_centred, change_row, change_vector, anchors, percent, feature_names, False, monotonicity_arr)
    print(res)






    
 


