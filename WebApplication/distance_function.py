import pandas as pd
import numpy as np
from model import SVM_model
from sklearn.manifold import MDS
from sklearn.decomposition import PCA


def generate_projection_files(pre_proc_file, X, y, out_path_changes, out_path_anchs):
	# --- Hardcoded Parameters --- 
	no_anchs = 4
	no_changes = 5


	pre_data = pd.read_csv(pre_proc_file, index_col=False).values

	# --- To ensure binary values ---
	for val in range(y.shape[0]):
		if y[val] > 0.5:
			y[val] = 1
		else:
			y[val] = 0


	anch_vectors, change_vectors, y_a, y_c = extract_vectors(pre_data, X, y)


	print("Calculating Changes Distance Matrix")
	changes = change_distances(change_vectors, y_c, False)
	# print("Calculating Anchor Distance Matrix")
	# anchs = anch_distances(anch_vectors, y_a, False)


	# np.savetxt(out_path_changes, changes, delimiter=",",fmt='%s')
	# np.savetxt(out_path_anchs, anchs, delimiter=",",fmt='%s')





def extract_vectors(pre_data,X,y):
	no_samp = X.shape[0]
	no_feat = X.shape[1]

	# --- Hardcoded Parameters --- 
	no_anchs = 4
	no_changes = 5
	start_col = 6

	empty_row_test = np.zeros((1,no_feat))

	change_vectors = []
	anch_vectors = []

	y_anch = []
	y_change = []
	
	for s in range(no_samp):
		a_row = np.zeros((no_feat,))
		empty = False
		for c in range(start_col,start_col+no_anchs):
			if (pre_data[s][3] == 0):
				empty = True
			if (pre_data[s][c] == -99 or pre_data[s][c] == -9):
				break
			else:
				ind = pre_data[s][c]
				a_row[ind] = 1

		if not empty:
			add = np.array([pre_data[s][0],pre_data[s][1],pre_data[s][2]])
			a_row = np.append(add,a_row)
			anch_vectors.append(a_row)

			if y[s] > 0.5:
				y_anch.append(1)
			else:
				y_anch.append(0)


		c_row = np.zeros((no_feat,))
		for c in range(start_col+no_anchs,start_col+no_anchs+no_changes):
			empty = False
			if (pre_data[s][4] == 0):
				empty = True
			if (pre_data[s][c] == -99 or pre_data[s][c] == -9):
				break
			else:
				ind = pre_data[s][c]
				change = pre_data[s][c+no_changes]
				c_row[ind] = change

		if not empty:
			cdd = np.array([pre_data[s][0],pre_data[s][1],pre_data[s][2]])
			c_row = np.append(cdd,c_row)
			change_vectors.append(c_row)

			if y[s] > 0.5:
				y_change.append(1)
			else:
				y_change.append(0)


	anch_vectors = np.array(anch_vectors)
	change_vectors = np.array(change_vectors)
	y_anch = np.array(y_anch)
	y_change = np.array(y_change)

	return anch_vectors,change_vectors,y_anch,y_change


def anch_distances(anch_vectors , y, directionality):
	# -- Anchor Distance Martix --
	# --- Intersection/Union --- 
	no_samp = anch_vectors.shape[0]
	anch_dist = np.zeros((no_samp,no_samp))


	ids = anch_vectors[:,:3]
	print(ids)
	anch_vectors = anch_vectors[:,3:]

	for ts in range(anch_vectors.shape[0]):
		if (ts % 100 == 0):
			pass
			# print("Starting sample", ts)
		test_sample = anch_vectors[ts]
		for cs in range(anch_vectors.shape[0]):
			compare_sample = anch_vectors[cs]
			
			union = 0
			inter = 0

			for feat in range(anch_vectors.shape[1]):
				test_val = np.float(test_sample[feat])
				comp_val = np.float(compare_sample[feat])

				if test_val and comp_val:
					inter += 1

				if test_val or comp_val:
					union += 1

			if (union == 0):
				i_over_u = 0 

			else:
				i_over_u = np.round(inter/union,3)

			if (directionality and y[ts] != y[cs]):
				i_over_u *= -1


			anch_dist[ts][cs] = i_over_u


	anchs_red = perform_dr(anch_dist)  # Reduced to two dimensions
	result = np.append(ids, anchs_red, axis=1)

	return result


def change_distances(change_vectors , y, directionality):
	# -- Changes Distance Martix --
	no_samp = change_vectors.shape[0]
	change_dist = np.zeros((no_samp,no_samp))

	ids = change_vectors[:,:3]
	print(ids)
	change_vectors = change_vectors[:,3:]

	for ts in range(change_vectors.shape[0]):

		test_sample = change_vectors[ts]
		if (ts % 100 == 0):
			pass 
			# print("Starting sample", ts)
		
		for cs in range(change_vectors.shape[0]):
			compare_sample = change_vectors[cs]
			
			union = 0
			inter = 0

			for feat in range(change_vectors.shape[1]):
				test_val = np.float(test_sample[feat])
				comp_val = np.float(compare_sample[feat])
				
				if (test_val and comp_val):
					if (abs(test_val)>abs(comp_val)):
						if (directionality):
							inter += comp_val/test_val
						else:
							inter += abs(comp_val/test_val)
					else:
						if (directionality):
							inter += test_val/comp_val
						else:
							inter += abs(test_val/comp_val)


				if (test_val or comp_val):
					union += 1

			if (union == 0):
				i_over_u = 0 

			else:
				i_over_u = np.round(inter/union,3)

			change_dist[ts][cs] = i_over_u



	changes_red = perform_dr(change_dist)  # Reduced to two dimensions
	result = np.append(ids, changes_red, axis=1)

	return result


def perform_dr(data):

	PCA_model = PCA(n_components = 2, svd_solver = 'full')
	X_pca = PCA_model.fit_transform(data)

	return X_pca


