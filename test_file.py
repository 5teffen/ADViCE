import numpy as np
import pandas as pd
from sklearn.neighbors.kde import KernelDensity
from sklearn import preprocessing
from operator import itemgetter
import copy

import matplotlib
import matplotlib.pyplot as plt


from Functions import *


# def kernel_density(pos_array, id_list, transform, monot=False):

# --- Identifying full densities --- 
def kernel_density(X,samples,transform):

	all_kernels = []
	partial_kernels = []


	# --- Identifying sample densities --- 
	transformed_samples = []
	for s in samples:
		transformed_samples.append(int(transform[str(s)]))

	filtered_X = X[transformed_samples]

	col_mean, col_median, sam_mean, sam_median = [], [], [], []

	for c in range(X.shape[1]):

		# --- Isolate feature column --- 
		col = X[:,c]  # All samples
		sam = filtered_X[:,c]  # Select samples


		# --- Set paramaters --- 
		max_val = max(10,np.amax(col))
		min_val = min(0,np.amin(col))
		scale = max_val+1 - min_val

		fineness = 1000


		# --- Reshaping --- 
		col = np.reshape(col, (col.shape[0],1))
		sam = np.reshape(sam, (sam.shape[0],1))

		X_axis = np.linspace(min_val,max_val,fineness)[:, np.newaxis]


		# --- Estimate density --- 
		kde_col = KernelDensity(kernel='gaussian', bandwidth=scale/20).fit(col)
		kde_sam = KernelDensity(kernel='gaussian', bandwidth=scale/20).fit(sam)
		log_dens_col = kde_col.score_samples(X_axis)
		log_dens_sam = kde_sam.score_samples(X_axis)

		kernel_col = np.exp(log_dens_col)
		kernel_sam = np.exp(log_dens_sam)


		# --- Normalize and Convert --- 
		min_max_scaler = preprocessing.MinMaxScaler(copy=True, feature_range=(0, 1))

		kernel_col = np.reshape(kernel_col, (kernel_col.shape[0],1))
		kernel_sam = np.reshape(kernel_sam, (kernel_sam.shape[0],1))

		kernel_col = min_max_scaler.fit_transform(kernel_col)
		kernel_sam = min_max_scaler.fit_transform(kernel_sam)

		all_kernels.append(kernel_col.flatten())
		partial_kernels.append(kernel_sam.flatten())
		
		# --- Estimate statistics values --- 
		col_mean.append(np.mean(col))
		col_median.append(np.median(col))
		
		sam_mean.append(np.mean(sam))
		sam_median.append(np.median(sam))


	return all_kernels, partial_kernels, sam_median, col_median 

	# print(all_kernels[1])


	# # --- Identifying sample densities --- 
	# transformed_samples = []
	# for s in samples:
	# 	transformed_samples.append(int(transform[str(s)]))

	# filtered_X = X[transformed_samples]

	# for c in range(filtered_X.shape[1]):

	# 	col = filtered_X[:,c][:100]
	# 	max_val = max(10,np.amax(col))
	# 	min_val = min(0,np.amin(col))
	# 	scale = max_val+1 - min_val

	# 	fineness = 1000

	# 	col = np.reshape(col, (col.shape[0],1))

	# 	X_axis = np.linspace(min_val,max_val,fineness)[:, np.newaxis]

	# 	kde = KernelDensity(kernel='gaussian', bandwidth=scale/20).fit(col)
	# 	log_dens = kde.score_samples(X_axis)

	# 	kernel = np.exp(log_dens)
	# 	min_max_scaler = preprocessing.MinMaxScaler(copy=True, feature_range=(0, 1))
	# 	kernel = np.reshape(kernel, (kernel.shape[0],1))
	# 	kernel = min_max_scaler.fit_transform(kernel)
	# 	partial_kernels.append(kernel.flatten())


	# 	return all_kernels, partial_kernels   # Output = 2 lists each are 


		# # plt.fill(X_axis[:, 0], np.exp(log_dens), fc='#AAAAFF')
		# plt.plot(X_axis[:, 0], np.exp(log_dens))
		# plt.show()
		

	# N = 20
	# X = np.concatenate((np.random.normal(0, 1, int(0.3 * N)),np.random.normal(5, 1, int(0.7 * N))))[:, np.newaxis]
	# print(X.shape)
	# X_plot = np.linspace(-5, 10, 1000)[:, np.newaxis]
	# bins = np.linspace(-5, 10, 10)

	# ax = plt.figure()
	# kde = KernelDensity(kernel='gaussian', bandwidth=0.75).fit(X)
	# log_dens = kde.score_samples(X_plot)
	# plt.fill(X_plot[:, 0], np.exp(log_dens), fc='#AAAAFF')
	# plt.show()





if __name__ == '__main__':
    vals = pd.read_csv("static/data/final_data_file.csv", header=None).values
    X = vals[:,1:]
    y = vals[:,0]

    vals_no_9 = prepare_for_analysis("static/data/final_data_file.csv")
    X_no_9 = vals_no_9[:,1:]

    no_samples, no_features = X.shape


    bins_centred, X_pos_array, init_vals = divide_data_bins(X_no_9,[9,10])
    # density_array = scaling_data_density(X_no_9, bins_centred)
    # print(len(density_array))

    trans = sample_transf(X)
    

    all_den, select_den, all_median , select_median = kernel_density(X_no_9, [1,2,3,4,5],trans)
    


    # result = populate_violin_plot(X_pos_array, np.array([1,2,3,4,5,6,7]),trans)
