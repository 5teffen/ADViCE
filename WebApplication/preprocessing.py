import pandas as pd
import numpy as np
from model import SVM_model
from individual_explanation import *



def create_summary_file(X, y, model, bins_centred, X_pos_array, init_vals, no_bins, monotonicity_arr, output_path, col_ranges, lock, perc_bar = True):
	np.random.seed(0)  #Ensures Uniformity 

	print(lock)

	# --- Hardcoded Parameters --- 
	no_anchs = 4
	no_changes = 5


	if perc_bar:
		print("Preprocessing Data:")

	no_samples, no_features = X.shape

	fp = open(output_path, 'w')
	fp.write("ID,Percentage,Category,no_Anch,no_Chg,Anch1,Anch2,Anch3,Anch4,Chg1,Chg2,Chg3,Chg4,Chg5,Hgt1,Hgt2,Hgt3,Hgt4,Hgt5\n")

	# --- ID NUMBERS AND ANCHORS AND CHANGES ARE INDEXED WITH 1 ---
	my_count = 0
	prev_val = 0
	for sample in range(no_samples):

		# print(np.random.normal())
		

		fp.write(str(sample+1))
		fp.write(',')

		### Run Explanation Algorithms
		change_vector, change_row, anchors, percent = instance_explanation(model, X, X[my_count], my_count, X_pos_array, bins_centred,
																				no_bins, monotonicity_arr, col_ranges, 1, True, lock)

		predicted = 0
		if percent>.5:
			predicted = 1
		ground_truth = y[sample]
		model_correct = 1
		if predicted != ground_truth:
			model_correct = 0
		category = "NA";
		if (predicted, model_correct) == (0,0):
			category = "FN"
		elif (predicted, model_correct) == (0,1):
			category = "TN"
		elif (predicted, model_correct) == (1,0):
			category = "FP"
		elif (predicted, model_correct) == (1,1):
			category = "TP"

		try:
			anchors1 = list(anchors)
		except:
			pass

		try:
			change_vector1 = list(change_vector)
		except:
			pass
		
		fp.write(str(percent))
		fp.write(',')
		fp.write(str(category))
		fp.write(',')

		if (anchors is not None):
			anch_cnt = anchors1.count(1)
			fp.write(str(anch_cnt)+",")
		else:
			fp.write("0,")
		if (change_vector is not None):
			chg_cnt = no_features - change_vector1.count(0)
			fp.write(str(chg_cnt)+",")
		else:
			fp.write("0,")

		if (anchors is not None):
			for i in range(no_features):
				if anchors1[i] == 1:
					fp.write(str(i))
					fp.write(",")
			for i in range(no_anchs - anch_cnt):
				fp.write("-99")
				fp.write(",")
		else:
			for i in range(no_anchs):
				fp.write("-99")
				fp.write(",")

		if (change_vector is not None):
			for i in range(no_features):
				if change_vector1[i] != 0:
					fp.write(str(i))
					fp.write(",")
			for i in range(no_changes - chg_cnt):
				fp.write("-99")
				fp.write(",")

			for i in range(no_features):
				if change_vector1[i] != 0:
					fp.write(str(change_vector1[i]))
					fp.write(",")
			for i in range(no_changes - chg_cnt):
				fp.write("-99")
				fp.write(",")
		
		else:
			for i in range(no_changes*2):
				fp.write("-99")
				fp.write(",")

		my_count += 1

		# --- Percentage Bar Indicating Progress --- 
		if perc_bar:
			percentage_done = int(np.round(((sample/no_samples)*100),0))
			# print("| ",end="")
			if prev_val != percentage_done:
				squares = percentage_done//5
				print('\r',"|",'#'*squares,end="")
				print(" "*(20-squares), "|", percentage_done, "%", end = "")
			prev_val = percentage_done



		fp.write('\n')

	print(" ")
	fp.close()