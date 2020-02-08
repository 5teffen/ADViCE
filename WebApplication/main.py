from flask import Flask
from flask import request, jsonify, json, redirect
from flask import render_template
import pandas as pd
import numpy as np

from model import *
from utils import *
from individual_explanation import *
from global_explanations import *
from queries import *
from d3_functions import *
from preprocessing import create_summary_file
from distance_function import generate_projection_files, reduce_raw_data
from projection import show_projection, show_projection2, full_projection

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
reset = False

# --- Dataset Selection ---
admissions_dataset = dataset("admissions", [6]) # (Conversion : Good > 0.7 )
diabetes_dataset = dataset("diabetes", [])
fico_dataset = dataset("fico", [0])
heart_dataset = dataset("heart", [1,5,6,8])
delinquency_dataset = dataset("delinquency", [9])
wine_dataset = dataset("wine", [])

dataset_dict = {
	'admissions': admissions_dataset,
	'diabetes': diabetes_dataset,
	'fico': fico_dataset,
	'heart': heart_dataset,
	'delinquency': delinquency_dataset,
	'wine':wine_dataset
}

# --- Data initialization ---
data_name, lock, folder_path, data_path, preproc_path, projection_changes_path, reduced_data_path, projection_anchs_path, no_bins, df, model_path, density_fineness = np.zeros(12)
categorical_cols, monotonicity_arr, feature_names, all_data, data, metadata, target, no_samples, no_features, svm_model, bins_centred, X_pos_array, init_vals = np.zeros(13)
col_ranges, all_den, all_median, all_mean, high_den, high_median, high_mean, low_den, low_median, low_mean, dict_array, dict_array_orig = np.zeros(12)
def init_data(dataset):

	global data_name, lock, folder_path, data_path, preproc_path, projection_changes_path,reduced_data_path, projection_anchs_path, no_bins, df, model_path, density_fineness
	global categorical_cols, monotonicity_arr, feature_names, all_data, data, metadata, target, no_samples, no_features, svm_model, bins_centred, X_pos_array, init_vals
	global col_ranges, all_den, all_median, all_mean, high_den, high_median, high_mean, low_den, low_median, low_mean, dict_array, dict_array_orig

	data_name = dataset.name
	lock = dataset.lock

	# --- Path Parameters --- 
	folder_path = "static/data/" + data_name + '/'
	data_path = folder_path + data_name + ".csv"
	preproc_path = folder_path + data_name + "_preproc.csv"
	projection_changes_path = folder_path + data_name + "_changes_proj.csv"
	projection_anchs_path = folder_path + data_name + "_anchs_proj.csv"
	reduced_data_path = folder_path + data_name + "_raw_proj"

	# print(reduced_data_path)

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
	high_data = all_data[all_data[:,-1] == 1][:,:-1]
	low_data =  all_data[all_data[:,-1] == 0][:,:-1]

	no_samples, no_features = data.shape

	# --- Initialize and train model ---
	svm_model = SVM_model(data,target)
	svm_model.train_model()
	svm_model.test_model()

	bins_centred, X_pos_array, init_vals, col_ranges = divide_data_bins(data,no_bins)  # Note: Does not account for categorical features
	all_den, all_median, all_mean = all_kernel_densities(data,feature_names,density_fineness) # Pre-load density distributions
	high_den, high_median, high_mean = all_kernel_densities(high_data,feature_names,density_fineness)
	low_den, low_median, low_mean = all_kernel_densities(low_data,feature_names,density_fineness)


	# --- oscar --- 
	# ==== FEATURE SELECTOR ====
	feature_selector_input = prep_feature_selector(1, feature_names, all_den, col_ranges) # 0 indexed

	dict_array = all_den
	dict_array_orig = all_den

	# --- Perform Preprocessing if new data --- 
	if not path.exists(preproc_path): 
		create_summary_file(data, target, svm_model, bins_centred, X_pos_array, init_vals, no_bins, monotonicity_arr, preproc_path, col_ranges, lock)
	elif reset:
			os.remove(preproc_path)
			create_summary_file(data, target, svm_model, bins_centred, X_pos_array, init_vals, no_bins, monotonicity_arr, preproc_path, col_ranges, lock)


	# --- Projection Files ---
	if ((not path.exists(projection_changes_path[:-4]+"_PCA.csv")) or (not path.exists(projection_anchs_path[:-4]+"_PCA.csv"))):
		generate_projection_files(preproc_path, data, target, projection_changes_path, projection_anchs_path) 
	elif reset:
			os.remove(projection_changes_path[:-4]+"_PCA.csv")
			os.remove(projection_anchs_path[:-4]+"_PCA.csv")
			os.remove(projection_changes_path[:-4]+"_TSNE.csv")
			os.remove(projection_anchs_path[:-4]+"_TSNE.csv")
			generate_projection_files(preproc_path, data, target, projection_changes_path, projection_anchs_path) 


	# --- Dimensionality reduction --- 
	if (not path.exists(reduced_data_path+"_TSNE.csv")) or (not path.exists(reduced_data_path+"_PCA.csv")): 
		reduce_raw_data(data, reduced_data_path, "PCA")
		reduce_raw_data(data, reduced_data_path, "TSNE")
	elif reset:
		os.remove(reduced_data_path+"_TSNE.csv")
		os.remove(reduced_data_path+"_PCA.csv")
		reduce_raw_data(data, reduced_data_path, "PCA")
		reduce_raw_data(data, reduced_data_path, "TSNE")



	# --- Metadata ---
	metadata = 	pd.read_csv(preproc_path, index_col=False).values



	all_params = {
		# data_name, lock, folder_path, data_path, preproc_path, projection_changes_path, projection_anchs_path, no_bins, df, model_path, density_fineness,
		# categorical_cols, monotonicity_arr, feature_names, all_data, data, target, no_samples, no_features, svm_model, bins_centred, X_pos_array, init_vals,
		# col_ranges, all_den, all_median, all_mean, dict_array, dict_array_orig

		'data_name': data_name,
		'lock': lock,
		'folder_path': folder_path,
		'data_path': data_path,
		'preproc_path': preproc_path,
		'projection_changes_path': projection_changes_path,
		'projection_anchs_path': projection_anchs_path,
		'no_bins': no_bins,
		'df': df,
		'model_path': model_path,
		'density_fineness': density_fineness,
		'categorical_cols': categorical_cols,
		'monotonicity_arr': monotonicity_arr,
		'feature_names': feature_names,
		'all_data': all_data,
		'data': data,
		'metadata':metadata,
		'target': target,
		'no_samples': no_samples,
		'no_features': no_features,
		'svm_model': svm_model,
		'bins_centred': bins_centred,
		'X_pos_array': X_pos_array,
		'init_vals': init_vals,
		'col_ranges': col_ranges,
		'all_den': all_den,
		'all_median': all_median,
		'all_mean': all_mean,
		'dict_array': dict_array,
		'dict_array_orig': dict_array_orig
	}

	return all_params

# --- Parameter Dictionary ---
PD = init_data(dataset_dict['heart'])

# ------- Initialize WebApp ------- #

app = Flask(__name__)

@app.route('/')
def hello():
    return redirect("/paper_intro")

@app.route('/challenge_intro')
def intro_site_challenge():
	return redirect("http://nyuvis-web.poly.edu/projects/fico/intro")

@app.route('/paper_intro')
def intro_site_paper():
	return render_template("index_intro_paper.html")

@app.route('/change_dataset', methods=['GET'])
def handle_change_dataset():
	if request.method == 'GET':
		dataset_name = request.args.get('dataset')
		print(dataset_name)

		global PD
		PD = init_data(dataset_dict[dataset_name])
		
		return preproc_path

# ------- Individual Explanations ------- #

@app.route('/individual')
def ind_site():
    return render_template("index_individual.html", no_samples=no_samples, no_features=no_features, preproc_path=preproc_path, locked=lock)

@app.route('/instance', methods=['GET'])
def handle_request():

	np.random.seed(0)

	if request.method == 'GET':
		sample = -10
		try:
			sample = int(request.args.get('sample'))
		except:
			return "Please enter a sample number in the range (1, "+ str(no_samples) + ")."

		if sample != -10:
			if sample<1 or sample>no_samples:
				return "Please enter a sample number in the range (1, "+ str(no_samples) + ")."
			else:
				sample-=1
				row = data[sample]			

				monot = (request.args.get('monot') == "True")
				sort = (request.args.get('sort') == "True")
				density = request.args.get('density')
				lock  = request.args.get('locked_features')[1:-1].split(',')
				
				if lock[0] == "none":
					lock = []
				if type(lock) in [int, str]:
					lock = [lock]
				lock = [int(e) for e in lock]
				# print(lock)

				sample, good_percent, model_correct, category, predicted = display_data(data,target,svm_model,sample,row)
				
				### Run MSC and Anchors
				# print(lock)
				change_vector, change_row, anchors, percent = instance_explanation(svm_model, data, row, sample, X_pos_array,
																				   bins_centred, no_bins, monotonicity_arr, col_ranges, 1, True, lock)

				### Parse values into python dictionary
				data_array = prepare_for_D3(row, bins_centred, change_row, change_vector, anchors, percent, feature_names, monot, monotonicity_arr, lock)
				dens_array = []
				if density == "High":
				    dens_array = high_den
				elif density == "Low":
				    dens_array = low_den
				else:
				    dens_array = all_den
				
				if sort:
					data_array, dens_array = sort_by_val(data_array, dens_array)

				ret_arr = [data_array, dens_array]
				
				# text_exp = generate_text_explanation(good_percent, X[sample], change_row, change_vector , anchors)
				# similar_ids = detect_similarities("static/data/pred_data_x.csv","static/data/final_data_file.csv", data[sample], change_row, bins_centred, good_percent)
				# similar_ids = similar_ids[:min(len(similar_ids),10)]
				ret_arr.append({'sample': sample+1, 'good_percent': good_percent, 'model_correct': model_correct,
							   'category': category, 'predicted': predicted})
				
				return json.dumps(ret_arr)

# ------- New Projection ------- #

@app.route('/projection')
def projection_site():
	show_projection(projection_changes_path[:-4]+"_PCA.csv", no_samples)
	return render_template("index_projection.html", no_features=no_features, feature_names=json.dumps(feature_names.tolist()), preproc_path=preproc_path)

@app.route('/scatter_req', methods=['GET'])
def scatter_request():

	if request.method == 'GET':

		ft_list = request.args.get('selected_fts')
		ft_list = ft_list[1:-1].split(',')

		# False = changes, True = keyfts
		algorithm = (request.args.get('algorithm') == "True")
		dim_red = request.args.get('dim_red')
		directionality = (request.args.get('directionality') == "True")
		confusion_mat = request.args.get('confusion_mat').split(',')
		pred_range = request.args.get('pred_range').split(',')
		pred_range = [int(x) for x in pred_range]
		# print(type(pred_range), pred_range)

		if ft_list[0] == '-1' or ft_list == ['']:
			ret_arr = list(range(data.shape[0]))

		else:
			ft_list = [int(x) for x in ft_list]
			ft_list.sort()
			ret_arr = ids_with_combination(preproc_path,ft_list,anchs=False)

		#show_projection(projection_changes_path[:-4]+"_"+dim_red+".csv", no_samples, algorithm=algorithm, selected_ids=ret_arr, dim_red=dim_red, directionality=True)
		#ret_arr = show_projection2(projection_changes_path[:-4]+"_"+dim_red+".csv", no_samples, algorithm=algorithm, selected_ids=ret_arr, dim_red=dim_red, directionality=True)

		all_points = full_projection(reduced_data_path+"_"+dim_red+".csv",preproc_path)


		# OSCAR: At the moment the logic is with only one set of filters. Should be easy to accomodate multiple.
		# 		 Probaly add a global list variable that stores the last filter_dict. 
		#		 Note: filter_dict always generates the filter_lst so always manipulate the filter_dict variable
		
		# ==== Filter Dictionary ==== 
		# Note: order is TP, FP, FN, TN 
		conf_list = [0,0,0,0]
		for label in confusion_mat:
			if label == "TP":
				conf_list[0] = 1
			if label == "FP":
				conf_list[1] = 1
			if label == "FN":
				conf_list[2] = 1
			if label == "TN":
				conf_list[3] = 1

		# // Filter Legend:
		# // 1 - Model Accuracy Range
		# // 2 - Prediction Label
		# // 3 - Feature Range

		filter_dict = {"1":[pred_range[0],pred_range[1]], "2":conf_list}
		

		# ==== Filter Dictionary -> D3 ====
		filter_lst = []
		# Note: this logic might reorder the filters (future fix)
		if ((pred_range[0] != 0) or (pred_range[1] != 100)):
			single_filter = [1, {"low":pred_range[0], "high":pred_range[1]}]
			filter_lst.append(single_filter)

		if (not all(v == 1 for v in conf_list)):
			single_filter = [2, {"tp":conf_list[0], "fp":conf_list[1] ,"fn":conf_list[2] ,"tn":conf_list[3]}]
			filter_lst.append(single_filter)

		print(filter_lst) # OSCAR: This needs to go to D3 feature selector as input



		# === Apply Masks === 

		start_mask = np.ones(data.shape[0])

		mask1 = query_pred_range(metadata, pred_range)
		mask2 = query_confusion_mat(metadata, confusion_mat)
		mask3 = query_feature_combs(metadata, [15,19])
		mask4 = query_value_range(data, 0, 60, 70)
		mask5 = query_similar_points(data,metadata,10,0.5)
		mask6 = query_sampled_data(data, 30)


		current_mask = start_mask*mask1*mask2 #*mask6

		result = apply_mask(all_points, current_mask)
		summary = prep_filter_summary(result, no_samples)


		## Parse values into python dictionary
		jsmask1 = [0]
		jsmask2 = current_mask.tolist()
		jsmask1.extend(jsmask2)
		ret_string = json.dumps([result, jsmask1, summary, filter_lst])
		return ret_string

@app.route('/violin_req')
def violin_site_req():

	if request.method == 'GET':

		proj_samples = request.args.get('id_list').split(',')

		if (proj_samples[0]=='' or proj_samples[0]=='-1'):
			return "-1"

		else:
			# --- Sort Features ---
			sort_toggle = False

			# sample_cap = min(len(proj_samples), 30)
			proj_samples = np.array([int(x)-1 for x in proj_samples])#[:sample_cap])
			# print(proj_samples)
			# print(data[proj_samples])
			# violin_arr = populate_violin_plot(X_pos_array, proj_samples, trans_dict)
			select_den, select_median, select_mean = specific_kernel_densities(data, proj_samples, feature_names, density_fineness)
			# all_den, select_den, all_median , select_median = kernel_density(X_no_9, proj_samples, trans_dict)
			# ret_string = json.dumps([np.array(all_den).tolist(), np.array(select_den).tolist(), np.array(all_median).tolist() , np.array(select_median).tolist()])
			aggr_data = prep_for_D3_aggregation(preproc_path, data, feature_names, proj_samples, bins_centred, X_pos_array, sort_toggle)
			ret_string = json.dumps([aggr_data, all_den, select_den, all_median , select_median, all_mean, select_mean])
			# ret_string = json.dumps([aggr_data, all_den, select_den, all_median , select_median])
			return ret_string

@app.route('/table_req')
def table_site_req():

	if request.method == 'GET':

		table_samples = request.args.get('id_list').split(',')

		if (table_samples[0]=='' or table_samples[0]=='-1'):
			return "-1"

		else:
			table_samples = np.array([int(x)-1 for x in table_samples]) #[:sample_cap])
			ret_string = json.dumps([metadata[table_samples,:3].tolist(), data[table_samples].tolist()])
			# print(ret_string)
			# ret_string = json.dumps([aggr_data, all_den, select_den, all_median , select_median])
			return ret_string


# ------- Run WebApp ------- #

if __name__ == '__main__':

	np.random.seed(12345)
	app.run(port=5005, host="0.0.0.0", debug=True, use_reloader=True)