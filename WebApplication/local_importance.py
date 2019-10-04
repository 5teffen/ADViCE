import numpy as np
import shap
import lime
import lime.lime_tabular
from copy import deepcopy as dc

def build_shap_explainer(model, dataset):
	# --- Summarizing the dataset ---
	# Can be fine tuned further (Kmeans, etc.)
	# summ = np.median(dataset, axis=0).reshape((1,dataset.shape[1]))
	summ = shap.kmeans(dataset, 100)
	print("Summary data for SHAP:", summ)
	explainer = shap.KernelExplainer(model.run_model_data_prob, summ, link="identity")
	print("Expected value for SHAP:", explainer.expected_value[1])
	return explainer

def shap_explanation(row, feature_names, explainer):
	row_shap = dc(row)
	return explainer.shap_values(row_shap)[1]

def build_lime_explainer(dataset, feature_names, categorical_features):
	np.random.seed(11)
	explainer = lime.lime_tabular.LimeTabularExplainer(dataset, feature_names=feature_names, categorical_features=categorical_features)
	return explainer

def lime_explanation(model, row, explainer):
	np.random.seed(11)
	lime_values = explainer.explain_instance(row, model.run_model_data_prob)
	lime_values = lime_values.as_map()[1]
	explained_vals = dict(lime_values)
	return [explained_vals[idx] if (idx in explained_vals) else 0 for idx in range(row.shape[0])]

def plot_local_imp(ft_imps, ft_names, ft_values):
	ft_imps = np.array(ft_imps)
	abs_ft_imp = np.abs(ft_imps)
	sort_idx = np.flip(np.argsort(abs_ft_imp))
	plot_imps = ft_imps / np.max(abs_ft_imp) if np.max(abs_ft_imp)>0 else ft_imps
	no_ft_plot = np.count_nonzero(plot_imps) if np.count_nonzero(plot_imps)<16 else 16
	ft_signs = np.sign(plot_imps)

	# --- Plot parameters ---
	p = {
		"width": 300,
		"height": 375,
		"starting_y": 15,
		"good_color": '#38e8eb',     # '#1b9e77' green    #'rgb(56, 232, 235)' light blue
		"bad_color": '#0698d1',      # '#d95f02' orange    #'rgb(6, 152, 209)' dark blue
		"line_y": 30,
		"bar_width": 6,
		"bar_spacing": 18,
		"first_bar_y": 46,
		"max_bar_size": 100,
		"point_offset": 5,
		"font_family": 'Source Sans Pro, sans-serif',
		"title_font_size": 18,
		"ft_name_size": 12,
		"text_offset": 3,
		"ft_magnitude_size": 12,
		"ft_magnitude_offset": 3
	}

	# --- Hover Styling ---
	svg_str = """
				<style>
				.feature-group {
				  position: relative;
				  display: inline-block;
				}

				.feature-group .tooltiptext {
				  visibility: hidden;
				  opacity: 0;
				  transition: opacity 0.1s;
				}

				.feature-group:hover {
				  font-weight: bold;
				}

				.feature-group:hover .tooltiptext {
				  visibility: visible;
				  font-weight: bold;
				  opacity: 1;
				}
				</style>
			"""

	svg_str += '<svg width="{width:d}px" height="{height:d}px" viewBox="0 -{starting_y:d} {width:d} {height:d}">'.format(
				**p)
	svg_str += '<line x1="{:d}" x2="{:d}" y1="{:d}" y2="{:d}" style="stroke-width: 1; stroke:  lightgray;"></line>'.format(
				int(p["width"]/2), int(p["width"]/2), int(p["line_y"]), int((2*p["bar_width"] + p["bar_spacing"])*no_ft_plot + 3*(p["first_bar_y"]-p["line_y"])))
	svg_str += '<text x="{:d}" y="15" font-size="{title_font_size}" font-family="{font_family}" text-anchor="middle" style="fill: {bad_color};">Below</text>'.format(
				int(p["width"]/4), **p)
	svg_str += '<text x="{:d}" y="15" font-size="{title_font_size}" font-family="{font_family}" text-anchor="middle" style="fill: {good_color};">Above</text>'.format(
				int(3*p["width"]/4), **p)

	cnt=0
	for i in sort_idx:
		# Only draw non-zero importance features 
		if cnt>=no_ft_plot:
			break
		# Don't draw importances if too small
		if np.abs(plot_imps[i])*p["max_bar_size"] < p["point_offset"]:
			break

		svg_str += '<g class="feature-group">'

		# --- Drawing polygons ---
		svg_str += '<polygon fill="{0}" points="{1},{2}  {5},{2}  {6},{3}  {5},{4}  {1},{4}" />'.format(
			p["good_color"] if ft_signs[i]==1 else p["bad_color"],
			int(p["width"]/2),
			int(p["first_bar_y"] + cnt*p["bar_spacing"] + 2*cnt*p["bar_width"]),
			int(p["first_bar_y"] + cnt*p["bar_spacing"] + 2*cnt*p["bar_width"] + p["bar_width"]),
			int(p["first_bar_y"] + cnt*p["bar_spacing"] + 2*cnt*p["bar_width"] + 2*p["bar_width"]),
			int(p["width"]/2 + plot_imps[i]*p["max_bar_size"] - ft_signs[i]*p["point_offset"]),
			int(p["width"]/2 + plot_imps[i]*p["max_bar_size"])
			)

		# --- Writing feature-value pairs ---
		svg_str += '<text x="{1}" y="{2}" text-anchor="{0}" font-size="{ft_name_size}" font-family="{font_family}">{3:.18} [{4}]</text>'.format(
			'begin' if ft_signs[i]==1 else 'end',
			int(p["width"]/2 + ft_signs[i]*p["text_offset"]),
			int(p["first_bar_y"] + cnt*p["bar_spacing"] + 2*cnt*p["bar_width"] - 1),
			ft_names[i],
			ft_values[i],
			**p
			)

		# --- Writing importance magnitudes ---
		svg_str += '<text class="tooltiptext" x="{1}" y="{2}" text-anchor="{0}" font-size="{ft_magnitude_size}" font-family="{font_family}">{3:.3f}</text>'.format(
			'begin' if ft_signs[i]==1 else 'end',
			int(p["width"]/2 + plot_imps[i]*p["max_bar_size"] + ft_signs[i]*1),
			int(p["first_bar_y"] + cnt*p["bar_spacing"] + 2*cnt*p["bar_width"] + p["bar_width"] + p["ft_magnitude_offset"]),
			abs_ft_imp[i],
			**p
			)

		svg_str += '</g>'

		cnt+=1


	svg_str += '</svg>'
	return svg_str


if __name__ == '__main__':

	import pandas as pd
	import sklearn
	from model import *
	from utils import *
	from individual_explanation import *
	from global_explanations import *
	from d3_functions import *
	from preprocessing import create_summary_file
	from os import path

	# ============= Initialize model =========== #

	# --- Setting random seed --- 
	np.random.seed(150)


	# --- User ---

	# user = "Steffen"
	user = "Oscar"

	if user == "Steffen":
		# --- Parameters --- 
		data_path = "static/data/diabetes.csv"
		preproc_path = "static/data/diabetes_preproc.csv"
		projection_changes_path = "static/data/changes_proj.csv"
		projection_anchs_path = "static/data/anchs_proj.csv"
		no_bins = 10


		# --- Data for diabetes ---
		df = pd.read_csv(data_path)

	elif user == "Oscar":
		# --- Parameters ---
		data_path = "static/data/ADS.csv"
		preproc_path = "static/data/ADS_preproc.csv"
		no_bins = 10

		# --- Data for education ---
		df = pd.read_csv(data_path)
		df["Gender"] = df["Gender"].apply(lambda gend: 0 if gend == "Male" else 1)
		df = df.drop(columns=['Academic Score',
		                'School','Grade',
		                'Term','Student'])
		df["Academic_Flag"] = df["Academic_Flag"].apply(lambda flag: 0 if flag == "No" else 1)

	model_path = "TBD"   # Manual? 

	feature_names = np.array(df.columns)[:-1]
	all_data = np.array(df.values)

	# -- Split data and target values --
	data = all_data[:,:-1]
	target = all_data[:,-1]
	no_samples, no_features = data.shape


	# --- Initialize and train model ---
	svm_model = SVM_model(data,target)
	svm_model.train_model()
	svm_model.test_model()

	# --- Run SHAP --
	i=0
	shap_explainer = build_shap_explainer(svm_model, data)
	shap_values = shap_explanation(data[i], feature_names, shap_explainer)
	print(shap_values)
	svg = plot_local_imp(shap_values, feature_names, data[i])
	fp = open("local_importance_shap.html", 'w', encoding="utf-8")
	fp.write(svg)
	fp.close()

	# --- Run LIME ---
	categorical_features = [0,1,2,3,4,7,8,9,17]
	lime_explainer = build_lime_explainer(data, feature_names, categorical_features)
	lime_values = lime_explanation(svm_model, data[i], lime_explainer)
	svg = plot_local_imp(lime_values, feature_names, data[i])
	fp = open("local_importance_lime.html", 'w', encoding="utf-8")
	fp.write(svg)
	fp.close()

	# # --- Test plot ---
	# test_imp = [2.266, -15.266, 3.266, -11.266, -0.8]
	# test_names = ['Aaaa', 'Bbbb', 'Ccccc', 'Dddd Ddddd Ddddddddd', 'Small']
	# test_values = [1, 2, 3, 4, 5]

	# svg = plot_local_imp(test_imp, test_names, test_values)
	# fp = open("local_importance_plot.html", 'w', encoding="utf-8")
	# fp.write(svg)
	# fp.close()
