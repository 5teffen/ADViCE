
import pandas as pd
import numpy as np
from model import *
from utils import *
from global_explanations import *




def prepare_for_D3(sample, bins_centred, change_row, change_vector, anchors, percent, names, apply_monot, monot_array, locked_fts=[]):
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
        
        val = round(sample[i]) #.round(0)
        # try:
        #   val = long(sample[i]).round(0)
        # except:
        #   print (sample[i],i, sample)
    
        if (change_row is None):
            change = val
        else:
            change = round(change_row[i]) #.round(0)
        
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
            result["locked"] = 1 if i in locked_fts else 0
            result["orig_ft_pos"] = i

        data.append(result)
        
    return data



def prep_for_D3_aggregation(pre_proc_file,X,names,samples,bins_centred,positions,sort = False):

  # --- Hardcoded Parameters --- 
  no_anchs = 4
  no_changes = 5
  start_col = 5

  # --- Constants --- 
  no_samp = X.shape[0]
  no_feat = X.shape[1]

  pre_data = pd.read_csv(pre_proc_file, index_col=False).values

  final_data = []


  for s in samples:
    single_dict_list = []
    for i in range(no_feat):
      result = {}
      result["name"] = names[i]
      result["sample"] = str(s+1)
      result["incr"] = 0 

      if pre_data[s][1] > 0.5:
        result["dec"] = 1
      else:
        result["dec"] = 0

      val = X[s][i].round(0)
      change = val

      # -- Identify Anchors --
      for an in range(start_col,start_col+no_anchs):
        col = pre_data[s][an]
        if (i == col):
          result["anch"] = 1

      # -- Find Change -- 
      for a in range(start_col+no_anchs,start_col+no_anchs+no_changes):
        col = pre_data[s][a]
        if (i == col):
          idx = positions[s][col]
          increments = pre_data[s][a+no_changes]
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
