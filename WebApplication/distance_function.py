import pandas as pd
import numpy as np
from model import SVM_model
from sklearn.manifold import MDS
from sklearn.decomposition import PCA


def generate_projection_files(pre_proc_file, X, y, out_path_changes, out_path_anchs):
	# --- Hardcoded Parameters --- 
	no_anchs = 4
	no_changes = 5


	pre_data = pd.read_csv(pre_proc_file).values

	# --- To ensure binary values ---
	for val in range(y.shape[0]):
		if y[val] > 0.5:
			y[val] = 1
		else:
			y[val] = 0


	anch_vectors, change_vectors, y_a, y_c = extract_vectors(pre_data, X, y)


	change_distances(change_vectors, y_c, False)
	anch_distances(anch_vectors, y_a, False)




	





def extract_vectors(pre_data,X,y):
	no_samp = X.shape[0]
	no_feat = X.shape[1]

	# --- Hardcoded Parameters --- 
	no_anchs = 4
	no_changes = 5

	empty_row_test = np.zeros((1,no_feat))

	change_vectors = []
	anch_vectors = []

	y_anch = []
	y_change = []
	
	for s in range(no_samp):
		a_row = np.zeros((no_feat,))
		empty = False
		for c in range(5,5+no_anchs):
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
		for c in range(5+no_anchs,5+no_anchs+no_changes):
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
	anch_vectors = anch_vectors[:,3:]

	for ts in range(anch_vectors.shape[0]):
		if (ts % 100 == 0):
			print("Starting sample", ts)
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

	result = np.append(ids,anch_dist,axis=1)
	result_red = perform_dr(result)
	
	
	# embedding = MDS(n_components=2)
	# transformed = embedding.fit_transform(anch_dist)

	# all_results = np.append(ids,transformed,axis=1)


	# np.savetxt("anchs.csv", all_results, delimiter=",",fmt='%s')

def change_distances(change_vectors , y, directionality):
	# -- Changes Distance Martix --
	no_samp = change_vectors.shape[0]
	change_dist = np.zeros((no_samp,no_samp))

	ids = change_vectors[:,:3]
	change_vectors = change_vectors[:,3:]

	for ts in range(change_vectors.shape[0]):

		test_sample = change_vectors[ts]
		if (ts % 100 == 0):
			print("Starting sample", ts)
		
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

	result = np.append(ids,change_dist,axis=1)

	result_red = perform_dr(result)
	# np.savetxt("changes_no_red_dir_" + str(directionality) + ".csv",np.append(ids,change_dist,axis=1) , delimiter=",",fmt='%s')
	
	# embedding = MDS(n_components=2)
	# transformed = embedding.fit_transform(change_dist)

	# all_results = np.append(ids,transformed,axis=1)

	# np.savetxt("changes.csv", all_results, delimiter=",",fmt='%s')

def perform_dr(data):
	ids = data[:,:3]
	X = data[:,3:]

	PCA_model = PCA(n_components = 2, svd_solver = 'full')
	X_pca = PCA_model.fit_transform(X)

	output = np.append(ids,X_pca,axis=1)

	return output




# anch_vectors, change_vectors, y_a, y_c = extract_vectors("static/data/final_data_file.csv","static/data/pred_data_x.csv")
# print(anch_vectors, change_vectors, y_a, y_c)

# change_distances(change_vectors, y_c, False)
# anch_distances(anch_vectors, y_a, False)

# perform_dr("changes_no_reduction.csv","changes_PCA")
# perform_dr("anchs_no_reduction.csv","anchs_PCA")

