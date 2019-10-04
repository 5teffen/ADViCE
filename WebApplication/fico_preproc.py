from flask import Flask
from flask import request, jsonify, json, redirect
from flask import render_template
import pandas as pd
import numpy as np

from model import *
from utils import *
from individual_explanation import *
from global_explanations import *
from d3_functions import *
from preprocessing import create_summary_file
from distance_function import generate_projection_files
from projection import show_projection

import os
from os import path


""" 
---- Tool Requirements ----

-- Data--
Binary Classification
Maximum 50 Features
First Row Header w/ Names
Last Column Target



"""


# ============= Initialize model =========== #

# --- Setting random seed --- 
np.random.seed(150)


# --- Resets all stored files ---
reset = True

# --- Dataset Selection ---

admissions_dataset = dataset("admissions", [7]) # (Conversion : Good > 0.7 )
diabetes_dataset = dataset("diabetes", [])
fico_dataset = dataset("fico", [])
heart_dataset = dataset("heart", [1,2,5,6,8,10,11,12])
delinquency_dataset = dataset("delinquency", [0,1,5,6,14])

dataset_dict = {
	'admissions': admissions_dataset,
	'diabetes': diabetes_dataset,
	'fico': fico_dataset,
	'heart': heart_dataset,
	'delinquency': delinquency_dataset
}

def init_data(dataset):

	data_name = dataset.name
	lock = dataset.lock

	# --- Path Parameters --- 
	folder_path = "static/data/" + data_name + '/'
	data_path = folder_path + data_name + ".csv"
	preproc_path = folder_path + data_name + "_preproc.csv"
	projection_changes_path = folder_path + data_name + "_changes_proj.csv"
	projection_anchs_path = folder_path + data_name + "_anchs_proj.csv"

	no_bins = 10

	df = pd.read_csv(data_path)


	model_path = "TBD"   # Manual? 

	# --- Advanced Parameters
	density_fineness = 100
	categorical_cols = []  # Categorical columns can be customized # Whether there is order
	monotonicity_arr = []  # Local test of monotonicity

	feature_names = np.array(df.columns)[:-1]
	all_data = np.array(df.values)

	# --- Split data and target values ---
	data = all_data[:,:-1]
	# data = np.array(data, dtype=float)
	target = all_data[:,-1]

	# --- Filter data by class ---
	# high_data = df.loc[df['Academic_Flag'] == 1].values[:,:-1]
	# low_data = df.loc[df['Academic_Flag'] == 0].values[:,:-1]

	no_samples, no_features = data.shape

	# --- Initialize and train model ---
	svm_model = SVM_model(data,target)
	svm_model.train_model()
	svm_model.test_model()

	bins_centred, X_pos_array, init_vals, col_ranges = divide_data_bins(data,no_bins)  # Note: Does not account for categorical features
	all_den, all_median, all_mean = all_kernel_densities(data,feature_names,density_fineness) # Pre-load density distributions
	# high_den, high_median, high_mean = all_kernel_densities(high_data,feature_names,density_fineness)
	# low_den, low_median, low_mean = all_kernel_densities(low_data,feature_names,density_fineness)

	dict_array = all_den
	dict_array_orig = all_den

	# --- Perform Preprocessing if new data --- 
	if not path.exists(preproc_path): 
		create_summary_file(data, target, svm_model, bins_centred, X_pos_array, init_vals, no_bins, monotonicity_arr, preproc_path, col_ranges)
	elif reset:
			os.remove(preproc_path)
			create_summary_file(data, target, svm_model, bins_centred, X_pos_array, init_vals, no_bins, monotonicity_arr, preproc_path, col_ranges)

	# --- Projection Files ---
	if ((not path.exists(projection_changes_path[:-4]+"_PCA.csv")) or (not path.exists(projection_anchs_path[:-4]+"_PCA.csv"))):
		generate_projection_files(preproc_path, data, target, projection_changes_path, projection_anchs_path) 
	elif reset:
			os.remove(projection_changes_path[:-4]+"_PCA.csv")
			os.remove(projection_anchs_path[:-4]+"_PCA.csv")
			generate_projection_files(preproc_path, data, target, projection_changes_path, projection_anchs_path) 


init_data(dataset_dict['fico'])