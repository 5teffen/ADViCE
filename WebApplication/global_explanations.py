import numpy as np
import pandas as pd
from sklearn.neighbors.kde import KernelDensity
from sklearn import preprocessing
from operator import itemgetter
import copy

def all_kernel_densities(X,names,fineness = 1000):

	all_kernels = []

	col_mean, col_median = [], []

	for c in range(X.shape[1]):

		# --- Isolate feature column --- 
		col = X[:,c]  # All samples


		# --- Set paramaters --- 
		max_val = max(10,np.amax(col))
		min_val = min(0,np.amin(col))
		scale = max_val+1 - min_val

		# --- Reshaping --- 
		col = np.reshape(col, (col.shape[0],1))
		X_axis = np.linspace(min_val,max_val,fineness)[:, np.newaxis]

		# --- Estimate density --- 
		kde_col = KernelDensity(kernel='gaussian', bandwidth=scale/20).fit(col)
		log_dens_col = kde_col.score_samples(X_axis)
		kernel_col = np.exp(log_dens_col)

		# --- Normalize and Convert --- 
		
		min_max_scaler = preprocessing.MinMaxScaler(copy=True, feature_range=(0, 1))

		kernel_col = np.reshape(kernel_col, (kernel_col.shape[0],1))
		kernel_col = min_max_scaler.fit_transform(kernel_col)

		kernel_col = [0] + kernel_col.flatten().tolist() + [0]

		# --- Single Dictionary --- 

		one_dict = {'name':names[c], 'data':kernel_col}
		all_kernels.append(one_dict)

		# --- Estimate statistics values ---

		med_val = np.median(col)/(max_val-min_val)
		mean_val = np.mean(col)/(max_val-min_val) 
		
		col_mean.append(mean_val)
		col_median.append(med_val)

	return all_kernels, col_median, col_mean

def specific_kernel_densities(X,samples,names,fineness=1000):
	partial_kernels = []

	# --- Identifying sample densities --- 
	filtered_X = X[samples]

	sam_mean, sam_median = [], []

	for c in range(X.shape[1]):

		# --- Isolate feature column --- 
		col = X[:,c]  # All samples
		sam = filtered_X[:,c]  # Select samples


		# --- Set paramaters --- 
		max_val = max(10,np.amax(col))
		min_val = min(0,np.amin(col))
		scale = max_val+1 - min_val


		# --- Reshaping --- 
		sam = np.reshape(sam, (sam.shape[0],1))

		X_axis = np.linspace(min_val,max_val,fineness)[:, np.newaxis]


		# --- Estimate density --- 
		kde_sam = KernelDensity(kernel='gaussian', bandwidth=scale/20).fit(sam)
		log_dens_sam = kde_sam.score_samples(X_axis)

		kernel_sam = np.exp(log_dens_sam)


		# --- Normalize and Convert --- 
		min_max_scaler = preprocessing.MinMaxScaler(copy=True, feature_range=(0, 1))

		kernel_sam = np.reshape(kernel_sam, (kernel_sam.shape[0],1))

		kernel_sam = min_max_scaler.fit_transform(kernel_sam)

		kernel_sam = [0]+kernel_sam.flatten().tolist()+[0]


		# --- Single Dictionary --- 

		one_dict = {'name':names[c], 'data':kernel_sam}
		
		partial_kernels.append(one_dict)

		# --- Estimate statistics values ---

		med_val = np.median(sam)/(max_val-min_val)
		mean_val = np.mean(sam)/(max_val-min_val) 
		
		sam_mean.append(mean_val)
		sam_median.append(med_val)


	return partial_kernels, sam_median, sam_mean






	