import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn import svm

class ModelError(Exception):
    pass

class SVM_model():
	def __init__ (self, data, target):

		self.model = None

		# -- Separate --
		self.y = target
		scaler = StandardScaler()
		self.X = scaler.fit_transform(data)

		# -- Needs to be retained for inserting new samples --
		self.mean = scaler.mean_
		self.scale = scaler.scale_

		self.num_samples, self.num_attributes = self.X.shape

		# -- Split Training/Test -- 
		self.X_tr, self.X_test, self.y_tr, self.y_test = train_test_split(
		self.X, self.y, test_size=0.2, random_state=11)

	def train_model(self,c_val=1):
		self.model = svm.SVC(kernel='linear', C=c_val, probability=True)
		self.model.fit(self.X_tr,self.y_tr.reshape(self.y_tr.shape[0],))

	def test_model(self, X_ts=None, y_ts=None):
		if (not self.model):
			raise ModelError("Train Model First")

		acc_train = self.model.score(self.X_tr, self.y_tr)
		acc_test = self.model.score(self.X_test, self.y_test)

		print("Training Accuracy:", acc_train, '%')
		print("Test Accuracy:", acc_test, '%')


	def __scaled_row(self, row):
	    scld = []
	    for k in range(row.shape[0]):
	        scld.append((row[k] - self.mean[k])/self.scale[k])
	    scld = np.array(scld)
	    scld2 = np.array([(row[k] - self.mean[k])/self.scale[k] for k in range(row.shape[0])])
	    
	    print(scld, scld2)
	    return np.array(scld)

	def run_model(self, sample):
		sample = self.__scaled_row(sample)
		if (not self.model):
			raise ModelError("Train Model First")

		result = self.model.predict_proba(sample.reshape(1, -1))

		return result[0][1]

	def run_model_data(self,data_set):
		if (not self.model):
			raise ModelError("Train Model First")

		for i in range(data_set.shape[0]):
			data_set[i] = self.__scaled_row(data_set[i])

		pred = self.model.predict(data_set)

		return pred 


 


