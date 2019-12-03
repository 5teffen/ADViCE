import pandas as pd
import numpy as np

from projection import full_projection



# Input: metadata (preproc data)

# =============== Prediction Range ============== 
def query_pred_range(meta, rang):
	low = rang[0]
	high = rang[1]
	no_samples = meta.shape[0]
	mask = np.zeros(no_samples)

	for i in range(no_samples):
		perc = meta[i][1]*100

		if ((perc >= low) and (perc < high)):
			mask[i] = 1
	return mask

# ======== Confusion Matrix Selection(s) ======== 
def query_confusion_mat(meta, targets):
	# Possible targets: TP, TN, FP, FN
	no_samples = meta.shape[0]
	mask = np.zeros(no_samples)

	for i in range(no_samples):
		pred = meta[i][2]
		if pred in targets:
			mask[i] = 1

	return mask

# ============ Feature Combinations =============
def query_feature_combs(meta, col_ids):
	no_samples = meta.shape[0]
	mask = np.zeros(no_samples)

	# --- Hardcoded Parameters --- 
	no_vertical_movement = 5
	no_lateral_movement = 5
	anch_iterations = 4

	for i in range(no_samples):
		col_lst = []

		range_val = range(5+anch_iterations,5+anch_iterations+no_lateral_movement)

		for c in range_val:
			col = meta[i][c]
			if (col < 0 or len(col_lst) > no_lateral_movement):
				break
			col_lst.append(col)
		
		if (set(col_ids).issubset(set(col_lst))):
			mask[i] = 1

	return mask

# ============= Feature Value Range =============
def query_value_range(data, col_id, low, high):
	no_samples = data.shape[0]
	mask = np.zeros(no_samples)

	target_col = data[:,col_id]
	for i in range(no_samples):
		val = target_col[i]
		if ((val >= low) and (val < high)):
			mask[i] = 1

	return mask

# ================ Similar Points ===============	
def query_similar_points(data, meta, idx, radius):
	# radius: The strictness in finding similar points. 0 - 1 
	no_samples = data.shape[0]
	mask = np.zeros(no_samples)

	target_point = data[idx]

	for i in range(no_samples):
		pass

	return mask

# =========== Create Sample of Points ===========	
def query_sampled_data(data, percentage):
	np.random.seed(1)
	no_samples = data.shape[0]
	mask = np.zeros(no_samples)
	remaining = int(round((no_samples*percentage/100), 0))
	mask[:remaining] = 1
	np.random.shuffle(mask)
	
	return mask

# ======== Use Mask to Filter Out Points ========
def apply_mask(all_samples, mask):
	result = []

	for i in range(len(all_samples)):
		if mask[i] == 1:
			result.append(all_samples[i])

	return result



if __name__ == '__main__':
	data = pd.read_csv("static/data/fico/fico.csv").values
	metadata = pd.read_csv("static/data/fico/fico_preproc.csv",index_col=False).values
	full_proj = full_projection("static/data/fico/fico_raw_proj_PCA.csv", "static/data/fico/fico_preproc.csv")

	start_mask = np.ones(data.shape[0])

	mask1 = query_pred_range(metadata, 10, 20)
	mask2 = query_confusion_mat(metadata, ["TN", "FN"])
	mask3 = query_feature_combs(metadata, [15,19])
	mask4 = query_value_range(data, 0, 60, 70)
	mask5 = query_similar_points(data,metadata,10,0.5)
	mask6 = query_sampled_data(data, 20)


	current_mask = start_mask*mask1*mask3

	result = apply_mask(full_proj, current_mask)
