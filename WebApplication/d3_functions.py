
import pandas as pd
import numpy as np
from model import *
from utils import *
from global_explanations import *


def prep_complete_data(metadata, data, names, samples, ranges, bins_centred, positions, sort = 0):
  # --- Output format ---
  # {"meta": meta_info, data": main_data, "den": histo_bins, "median":median}

  # --- Sort Types --- 
  # 0: No sort
  # 1: Median sort
  # 2: KL divergence sort
  # 3: CF sort


  # --- Hardcoded Parameters --- 
  no_anchs = 4
  no_changes = 5
  start_col = 5

  # --- Categorical Feature Mask --- 
  category_mask = [0 for x in range(data.shape[1])]


  # --- Constants --- 
  no_samp = data.shape[0]
  no_feat = data.shape[1]
  no_bins = bins_centred[0].shape[0]


  # --------------------------------------------------------------------

  # ======== Creating metadata ========
  meta = []
  for f in range(no_feat):
    single_col = {}
    single_col["name"] = names[f]  # Feature name

    ft_ranges = ranges[f]  # Ranges for single ft
    bins_lst = []

    # -- Identify if categorical --- 
    if isinstance(ft_ranges[-1], str): # Find "-1"
      single_col["cat"] = 1   
    else:
      single_col["cat"] = 0 


    for r in range(len(ft_ranges)):
      one_range = ft_ranges[r]

      if isinstance(one_range, str): # Stop at "-1"
        break

      else:
        low, high =  one_range[0], one_range[1]

        if single_col["cat"]: # Only one value for cat
          bins_lst.append([int(low)])

        else: # Min, Max value for non-cat
          bins_lst.append([int(low),int(high-1)])

    single_col["bins"] = bins_lst

    if single_col["cat"]:
      single_col["min"] = bins_lst[0]
      single_col["max"] = bins_lst[-1]

    else:
      single_col["min"] = bins_lst[0][0]
      single_col["max"] = bins_lst[-1][1]

    meta.append(single_col)   


  # --------------------------------------------------------------------

  # ===== Creating datapoints (w. CF) =====
  main_data = []
  for s in samples:
    single_dict_list = [] # Corresponds to one point
    for f in range(no_feat):
      result = {}
      result["name"] = names[f]
      result["sample"] = str(s+1)  # one-indexed
      result["incr"] = 0 

      if metadata[s][1] > 0.5:
        result["dec"] = 1
      else:
        result["dec"] = 0


      # --- Equate by default --- 
      val = data[s][f].round(0)   # FIX for FLOATS!!!
      change = val


      # --- Find Counter Factual when occurs ---
      for a in range((start_col+no_anchs) , (start_col+no_anchs+no_changes)):  # Format of metadata
        col = metadata[s][a]
        if (f == col):  # Identifies feat column with changes
          idx = positions[s][col] 
          increments = metadata[s][a+no_changes]
          change = bins_centred[f][int(idx+increments)]  # Target value based on bin centres


      max_bin = np.max(bins_centred[f])
      min_bin = bins_centred[f][0]

      if (max_bin - min_bin < no_bins):
        max_bin = min_bin + no_bins

      # -- Add bin max/min to metadata -- 
      meta[f]["max_bin"] = max_bin
      meta[f]["min_bin"] = min_bin

      # --- Normalize to [1,0] --- 
      scl_val = ((val-min_bin)/(max_bin-min_bin)).round(2)
      scl_change = ((change-min_bin)/(max_bin-min_bin)).round(2)


      # --- Points outside 2 stds ---
      if (scl_val < 0):
        scl_val = 0
      if (scl_val > 1):
        scl_val = 1
      if (scl_change < 0): # Occurs when no CF
        scl_change = 0
      if (scl_change > 1):
        scl_change = 1
       
      # --- Scale max/min of ft --- 
      # To be added


      # --- Update dictionary --- 
      result["scl_val"] = float(scl_val)
      result["scl_change"] = float(scl_change)

      single_dict_list.append(result)

    main_data.append(single_dict_list)


  # --------------------------------------------------------------------
 
  # ===== Create distribution histogram  =====
  histo_bins =  [list(np.zeros((no_bins,))) for i in range(no_feat)]
  for s in samples:
    for f in range(no_feat):
      val = data[s][f].round(0)   # FIX for FLOATS!!!

      the_bins = meta[f]["bins"]  # Bins used for CF. Use same. 

      for b in range(len(the_bins)):
        one_bin = the_bins[b]

        if len(one_bin) == 2:  # == NON-CATEGORICAL
          l, h = one_bin  # low, high

          if (b == 0 and val < l):  # Smaller than first bin
            histo_bins[f][0] += 1
            break

          elif (b == len(the_bins)-1 and val > h):  # Bigger than last bin
            histo_bins[f][b] += 1
            break

          elif(l <= val and val <= h): 
            histo_bins[f][b] += 1
            break

        if len(one_bin) == 1:  # == CATEGORICAL
          l = one_bin[0]

          if (val == l):
            histo_bins[f][b] += 1
            break

  # -- Normalize the Histogram --
  for hb in range(len(histo_bins)):
    highest_count = np.amax(histo_bins[hb])
    histo_bins[hb] = list(np.around(histo_bins[hb]/highest_count,3))
  

  # --------------------------------------------------------------------
 
  # ===== Create feature median list =====
  median_lst = []
  for f in range(no_feat):
    ft_vals = []
    for s in samples:
      val = data[s][f].round(0)  # FIX for FLOATS!!!
      ft_vals.append(val)

    # -- Scale according to bins --  
    median = np.median(ft_vals)
    min_bin = meta[f]["min_bin"]
    max_bin = meta[f]["max_bin"]
    scl_median = ((median-min_bin)/(max_bin-min_bin)).round(3)
    median_lst.append(scl_median)


  # --------------------------------------------------------------------
 
  # ===== Apply different sorts =====
  # 0: No sort               # 1: Median sort
  # 2: KL divergence sort    # 3: CF sort
  if sort == 1:
    pass

  elif sort == 2:
    pass

  elif sort == 3:
    pass



  # +++++++ Compile complete data +++++++ 
  complete_data = {"meta": meta, "data": main_data, "den": histo_bins, "median":median_lst} 



  return complete_data
  #   no_ft = len(data_dict[0])
  # col_bins =  [list(np.zeros((no_bins,))) for i in range(no_ft)]
  # med_lsts = empty_lists = [[] for i in range(no_ft)]  # Add up the values for each column


  # # return final_data
  # final_data = np.array(final_data)
  # # return(final_data.tolist())

  # # -- Sorting based on the number of arrows -- 
  # if sort == True:
  #   count_list = np.zeros((final_data.shape[1],))
  #   for c in range(final_data.shape[1]):
  #     col = final_data[:,c]
  #     count = 0
  #     for sample in col:
  #       if sample['scl_val'] != sample['scl_change']:
  #         count += 1

  #     count_list[c] = count

  #   keySort = np.argsort(count_list)[::-1]

  #   final_result = np.array([])

  #   for key in keySort:
  #     if final_result.any() == False:
  #       final_result = final_data[:,key].reshape(-1,1)
  #     else:
  #       final_result = np.append(final_result,final_data[:,key].reshape(-1,1), axis = 1)

  #   return final_result.tolist()

  # else:
  #   return final_data.tolist()














def prep_histo_data(data_dict, no_bins = 10):
  no_ft = len(data_dict[0])
  col_bins =  [list(np.zeros((no_bins,))) for i in range(no_ft)]
  med_lsts = empty_lists = [[] for i in range(no_ft)]  # Add up the values for each column

  for sample in data_dict:
    for c in range(len(sample)):
      one_ft = sample[c]
      scl_val = one_ft["scl_val"]
      med_lsts[c].append(scl_val)
      
      for b in range(no_bins):
        floor = round((0 + b*0.1),2)
        ceil = round((0.1 + b*0.1),2)

        if (scl_val < ceil) and (scl_val >= floor):
          # print(scl_val, floor, ceil, b)
          col_bins[c][b] += 1
          break


  # --- Normalize Histogram ---
  for cb in range(len(col_bins)):
    highest_count = np.amax(col_bins[cb])
    col_bins[cb] = list(np.round(col_bins[cb]/highest_count, 3))


  # --- Calculate Median  ---
  med_result = []

  for med_col in med_lsts:
    med = np.median(med_col)
    med_result.append(med)
  #   highest_count = np.amax(col_bins) 
  #   col_bins = list(col_bins/highest_count)
  #   result.append(col_bins)
  # print(col_bins)
  return col_bins, med_result



def prep_percentage_filter(metadata, no_bins, samples = []):
  result = np.zeros((no_bins,))
  pos_result = np.zeros((no_bins,))
  neg_result = np.zeros((no_bins,))
  one_bin = 100/no_bins

  # ---- OPTION 1: Generate histogram for all datapoints ----
  if samples == []:  
    for i in range(metadata.shape[0]):
      perc = metadata[i][1]*100
      lab = metadata[i][2]

      # Identify ground truth 
      if lab == "TP" or lab == "FN":
        pos = True  
      else:
        pos = False 


      floor = 0
      ceil = one_bin

      for b in range(no_bins):
        # -- Edge Cases -- 
        if (b == 0 and perc < one_bin):
          result[0] += 1

          if pos:
            pos_result[0] += 1
          else:
            neg_result[0] += 1
          break

        elif (b == (no_bins-1)):
          result[no_bins-1] += 1

          if pos:
            pos_result[no_bins-1] += 1
          else:
            neg_result[no_bins-1] += 1
          break

        elif ((perc >= floor) and (perc < ceil)):
          result[b] += 1

          if pos:
            pos_result[b] += 1
          else:
            neg_result[b] += 1
          break
       
        floor += one_bin
        ceil += one_bin

    # -- Scale the bins --
    highest_count = np.amax(result)      
    result = (result/highest_count).tolist()
    pos_result = (pos_result/highest_count).tolist()
    neg_result = (neg_result/highest_count).tolist()
    return [result,pos_result,neg_result]


  # ---- OPTION 2: Generate histogram for specific datapoints ----
  else:
    for s in samples:
      perc = metadata[s][1]*100

      floor = 0
      ceil = one_bin

      for b in range(no_bins):
        # -- Edge Cases -- 
        if (b == 0 and perc < one_bin):
          result[0] += 1
          break

        elif (b == (no_bins-1)):
          result[no_bins-1] += 1
          break

        elif ((perc >= floor) and (perc < ceil)):
           result[b] += 1
           break
       
        floor += one_bin
        ceil += one_bin

    # -- Scale the bins --
    highest_count = np.amax(result)      
    result = (result/highest_count).tolist()
    return result



def prep_confusion_matrix(metadata, samples = []):

  tp = 0
  fp = 0 
  tn = 0
  fn = 0

  # ---- OPTION 1: All datapoints ----
  if samples == []:
    for s in range(metadata.shape[0]):
      val = metadata[s][2]
      if val == "TP":
        tp += 1
      elif val == "FP":
        fp += 1 
      elif val == "TN":
        tn += 1 
      elif val == "FN":
        fn += 1


  # ---- OPTION 2: Select datapoints ----
  else:
    for s in samples:
      val = metadata[s][2]
      if val == "TP":
        tp += 1
      elif val == "FP":
        fp += 1 
      elif val == "TN":
        tn += 1 
      elif val == "FN":
        fn += 1


  result = {"tp":tp, "fp":fp, "tn":tn, "fn":fn}
  return result



def prep_filter_summary(points, no_samples):
  tp = 0
  fp = 0 
  tn = 0
  fn = 0 
  count = 0
  for p in points:
    cat = p['category']
    if cat == "TP":
      tp += 1
    elif cat == "FP":
      fp += 1 

    elif cat == "TN":
      tn += 1 

    elif cat == "FN":
      fn += 1

    count += 1

  result = {"tot_p": no_samples, "no_p": count, "tp":tp, "fp":fp, "tn":tn, "fn":fn,   }

  return result



def prep_feature_selector(data, feature_no, names, ranges, no_bins, samples, init = None):
  out_dict = {}

  # out_dict["den"] = all_den[feature_no]['data']
  out_dict["id"] = feature_no

  no_samp, no_feat = data.shape
  no_bins = ranges.shape[1]

  result = []

  col = data[:,feature_no]
  col_range = ranges[feature_no]

  # print(col_range)
  col_bins = [0 for x in range(no_bins) if not isinstance(ranges[feature_no][x], str)]


  # ---- OPTION 1: Generate histogram for all datapoints ----
  if samples == []:   # OPTION 1: Generate histogram for all datapoints

    for s in range(no_samp):
      sample = col[s]

      for b in range(no_bins):
        
        floor = ranges[feature_no][b][0]
        ceil = ranges[feature_no][b][1]

        if (b == 0 and sample < ceil): #Edge case first bin
          col_bins[0] += 1
          break

        elif (b == (no_bins-1)):  #Edge case last bin
          col_bins[no_bins-1] += 1
          break

        elif isinstance(ranges[feature_no][b+1], str): #Edge case fewer than standard no_bins
          col_bins[b] += 1
          break

        elif ((sample >= floor) and (sample < ceil)):
          col_bins[b] += 1
          break


    # ---- OPTION 2: Generate histogram for specific datapoints ----
    else:
      for s in samples:
        sample = col[s]

        for b in range(no_bins):
          
          floor = ranges[feature_no][b][0]
          ceil = ranges[feature_no][b][1]

          if (b == 0 and sample < ceil): #Edge case first bin
            col_bins[0] += 1
            break

          elif (b == (no_bins-1)):  #Edge case last bin
            col_bins[no_bins-1] += 1
            break

          elif isinstance(ranges[feature_no][b+1], str): #Edge case fewer than standard no_bins
            col_bins[b] += 1
            break

          elif ((sample >= floor) and (sample < ceil)):
            col_bins[b] += 1
            break

    # --- Normalize Histogram ---
    highest_count = np.amax(col_bins) 
    col_bins = list(col_bins/highest_count)
    # result.append(col_bins)


  out_dict["den"] = col_bins
  
  feat_range = ranges[feature_no]
  min_val = feat_range[0][0]
  max_val = 0  
  for i in range(len(feat_range)):  # Finding the max range value
    if (i == len(feat_range)-1):
      max_val = feat_range[i][1]

    elif (feat_range[i+1] == '-1'):
      max_val = feat_range[i][1]
      break

  out_dict["range"] = [min_val,max_val]

  if init == None:
    out_dict["current"] = [min_val,max_val]

  else:
    out_dict["current"] = init

  return out_dict



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



def prep_for_D3_aggregation(metadata,X,names,samples,bins_centred,positions,sort = False):

  # --- Hardcoded Parameters --- 
  no_anchs = 4
  no_changes = 5
  start_col = 5

  # --- Constants --- 
  no_samp = X.shape[0]
  no_feat = X.shape[1]

  final_data = []


  for s in samples:
    single_dict_list = []
    for i in range(no_feat):
      result = {}
      result["name"] = names[i]
      result["sample"] = str(s+1)
      result["incr"] = 0 

      if metadata[s][1] > 0.5:
        result["dec"] = 1
      else:
        result["dec"] = 0

      val = X[s][i].round(0)   # FIX
      change = val

      # -- Identify Anchors --
      for an in range(start_col,start_col+no_anchs):
        col = metadata[s][an]
        if (i == col):
          result["anch"] = 1

      # -- Find Change -- 
      for a in range(start_col+no_anchs,start_col+no_anchs+no_changes):
        col = metadata[s][a]
        if (i == col):
          idx = positions[s][col]
          increments = metadata[s][a+no_changes]
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

      if (scl_val > 1 ):
        scl_val = 1
      
      if (scl_change < 0):
        scl_change = 0

      if (scl_change > 1 ):
        scl_change = 1

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



def prep_histo_data_old(data,ranges, samples = []):

  no_samp, no_feat = data.shape
  no_bins = ranges.shape[1]

  result = []

  for c in range(no_feat):
    col = data[:,c]
    col_range = ranges[c]

    col_bins =  list(np.zeros((no_bins,)))


    # ---- OPTION 1: Generate histogram for all datapoints ----
    if samples == []:   # OPTION 1: Generate histogram for all datapoints

      for s in range(no_samp):
        sample = col[s]

        for b in range(no_bins):
          
          floor = ranges[c][b][0]
          ceil = ranges[c][b][1]

          if (b == 0 and sample < ceil): #Edge case first bin
            col_bins[0] += 1
            break

          elif (b == (no_bins-1)):  #Edge case last bin
            col_bins[no_bins-1] += 1
            break

          elif isinstance(ranges[c][b+1], str): #Edge case fewer than standard no_bins
            col_bins[b] += 1
            break

          elif ((sample >= floor) and (sample < ceil)):
            col_bins[b] += 1
            break


    # ---- OPTION 2: Generate histogram for specific datapoints ----
    else:
      for s in samples:
        sample = col[s]

        for b in range(no_bins):
          
          floor = ranges[c][b][0]
          ceil = ranges[c][b][1]

          if (b == 0 and sample < ceil): #Edge case first bin
            col_bins[0] += 1
            break

          elif (b == (no_bins-1)):  #Edge case last bin
            col_bins[no_bins-1] += 1
            break

          elif isinstance(ranges[c][b+1], str): #Edge case fewer than standard no_bins
            col_bins[b] += 1
            break

          elif ((sample >= floor) and (sample < ceil)):
            col_bins[b] += 1
            break


      # --- Normalize Histogram ---

    highest_count = np.amax(col_bins) 
    col_bins = list(col_bins/highest_count)
    result.append(col_bins)

  return result



def prep_feature_selector_simple(data, feature_no, names, ranges, no_bins, samples, init = None):
  out_dict = {}

  # out_dict["den"] = all_den[feature_no]['data']
  out_dict["id"] = feature_no

  no_samp, no_feat = data.shape
  no_bins = ranges.shape[1]

  result = []

  col = data[:,feature_no]
  col_range = ranges[feature_no]

  col_bins =  list(np.zeros((no_bins,)))


  # ---- OPTION 1: Generate histogram for all datapoints ----
  if samples == []:   # OPTION 1: Generate histogram for all datapoints

    for s in range(no_samp):
      sample = col[s]

      for b in range(no_bins):
        
        floor = ranges[feature_no][b][0]
        ceil = ranges[feature_no][b][1]

        if (b == 0 and sample < ceil): #Edge case first bin
          col_bins[0] += 1
          break

        elif (b == (no_bins-1)):  #Edge case last bin
          col_bins[no_bins-1] += 1
          break

        elif isinstance(ranges[feature_no][b+1], str): #Edge case fewer than standard no_bins
          col_bins[b] += 1
          break

        elif ((sample >= floor) and (sample < ceil)):
          col_bins[b] += 1
          break


    # ---- OPTION 2: Generate histogram for specific datapoints ----
    else:
      for s in samples:
        sample = col[s]

        for b in range(no_bins):
          
          floor = ranges[feature_no][b][0]
          ceil = ranges[feature_no][b][1]

          if (b == 0 and sample < ceil): #Edge case first bin
            col_bins[0] += 1
            break

          elif (b == (no_bins-1)):  #Edge case last bin
            col_bins[no_bins-1] += 1
            break

          elif isinstance(ranges[feature_no][b+1], str): #Edge case fewer than standard no_bins
            col_bins[b] += 1
            break

          elif ((sample >= floor) and (sample < ceil)):
            col_bins[b] += 1
            break

    # --- Normalize Histogram ---
    highest_count = np.amax(col_bins) 
    col_bins = list(col_bins/highest_count)
    result.append(col_bins)

  
  feat_range = ranges[feature_no]
  min_val = feat_range[0][0]
  max_val = 0  
  for i in range(len(feat_range)):  # Finding the max range value
    if (i == len(feat_range)-1):
      max_val = feat_range[i][1]

    elif (feat_range[i+1] == '-1'):
      max_val = feat_range[i][1]
      break

  out_dict["range"] = [min_val,max_val]

  if init == None:
    out_dict["current"] = [min_val,max_val]

  else:
    out_dict["current"] = init

  return out_dict




