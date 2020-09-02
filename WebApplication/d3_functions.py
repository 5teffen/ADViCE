
import pandas as pd
import numpy as np
from model import *
from utils import *
from global_explanations import *


def prep_complete_data(metadata, data, names, samples, ranges, bins_centred, positions):
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

    single_col["no_bins"] = no_bins  # Number of bins for easy access

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
      single_col["min"] = bins_lst[0][0]
      single_col["max"] = bins_lst[-1][0]

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

      # --- Record value ---
      result["val"] = val

      # -- Bin index --
      # result["bin_id"] = positions[s][f] # Doesn't match
      the_bins = meta[f]["bins"]  # Bins used for CF. Use same. 
      for b in range(len(the_bins)): 
        one_bin = the_bins[b]

        if len(one_bin) == 2:  # == NON-CATEGORICAL
          l, h = one_bin  # low, high

          if (b == 0 and val < l):  # Smaller than first bin
            result["bin_id"] = b
            break

          elif (b == len(the_bins)-1 and val > h):  # Bigger than last bin
            result["bin_id"] = b
            break

          elif(l <= val and val <= h): 
            result["bin_id"] = b
            break

        if len(one_bin) == 1:  # == CATEGORICAL
          l = one_bin[0]

          if (val == l):
            result["bin_id"] = b
            break

      # --- Find Counter Factual when occurs ---
      for a in range((start_col+no_anchs) , (start_col+no_anchs+no_changes)):  # Format of metadata
        col = metadata[s][a]
        if (f == col):  # Identifies feat column with changes
          idx = positions[s][col] 
          increments = metadata[s][a+no_changes]
          change = bins_centred[f][int(idx+increments)]  # Target value based on bin centres
          # result["bin_id"] = int(idx+increments)

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
    histo_bins[hb] = list(np.around(histo_bins[hb]/highest_count,5))
  

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
 

  # +++++++ Compile complete data +++++++ 
  complete_data = {"meta": meta, "data": main_data, "den": histo_bins, "median":median_lst} 

  return complete_data



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
    # print(">>>>>>>> OPTION 1 <<<<<<<<<<")
    # print("res", len(result))
    # print("pos", len(pos_result))
    # print("neg", len(neg_result))
    return [result,pos_result,neg_result]

  # ---- OPTION 2: Generate histogram for specific datapoints ----
  else:
    for s in samples:
      perc = metadata[s][1]*100
      lab = metadata[s][2]

      floor = 0
      ceil = one_bin

      # Identify ground truth 
      if lab == "TP" or lab == "FN":
        pos = True  
      else:
        pos = False 


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
    # print(">>>>>>>> OPTION 2 <<<<<<<<<<")
    # print("res", len(result))
    # print("pos", len(pos_result))
    # print("neg", len(neg_result))
    return [result,pos_result,neg_result]



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



def prep_feature_selector(data, meta, ft_no, samples = []):
  
  # -- Dictionary for D3 visualisation --
  # - name, range, den, current, cat, 
  out_dict = {}

  # -- Constants -- 
  no_bins = len(meta[ft_no]["bins"])
  no_feat = data.shape[1]
  no_samp = data.shape[0]

  # ===== Create distribution histogram  =====
  histo_bins = list(np.zeros((no_bins,)))

  if (samples == []):
    samples = [x for x in range(no_samp)]

  for s in samples:
    val = data[s][ft_no].round(0)   # FIX for FLOATS!!!

    the_bins = meta[ft_no]["bins"]  # Bins used for CF. Use same. 

    for b in range(len(the_bins)):
      one_bin = the_bins[b]

      if len(one_bin) == 2:  # == NON-CATEGORICAL
        l, h = one_bin  # low, high

        # -- Note bin values -- 
        


        if (b == 0 and val < l):  # Smaller than first bin
          histo_bins[0] += 1
          break

        elif (b == len(the_bins)-1 and val > h):  # Bigger than last bin
          histo_bins[b] += 1
          break

        elif(l <= val and val <= h): 
          histo_bins[b] += 1
          break

      if len(one_bin) == 1:  # == CATEGORICAL
        l = one_bin[0]

        if (val == l):
          histo_bins[b] += 1
          break

  # -- Normalize the Histogram --
  highest_count = np.amax(histo_bins)
  histo_bins = list(np.around(histo_bins/highest_count,5))



  # +++++++ Compile output +++++++ 
  out_dict["id"] = ft_no
  out_dict["name"] = meta[ft_no]["name"]
  out_dict["cat"] = meta[ft_no]["cat"]
  out_dict["den"] = histo_bins
  out_dict["range"] = [meta[ft_no]["min"], meta[ft_no]["max"]]
  out_dict["current"] = [meta[ft_no]["min"], meta[ft_no]["max"]] # Potentially changed
  out_dict["bin_vals"] = 0
  out_dict["bin_ids"] = [x for x in range(len(histo_bins))]

  return out_dict



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


