import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn import svm
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# Imports parent module to modify the global variable used to communicate with R
# https://stackoverflow.com/questions/1054271/how-to-import-a-python-class-that-is-in-a-directory-above
#from .. import py_expl as parent

class ModelError(Exception):
    pass

class ML_model():

	def __init__ (self, data, target, rand_state=11):

		self.model = None
		self.rand_state = rand_state
		self.model_calls = 0

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
		self.X, self.y, test_size=0.2, random_state=rand_state)

	def test_model(self, X_ts=None, y_ts=None):
		if (not self.model):
			raise ModelError("Train Model First")

		acc_train = self.model.score(self.X_tr, self.y_tr)
		acc_test = self.model.score(self.X_test, self.y_test)

		print("Training Accuracy:", acc_train*100, '%')
		print("Test Accuracy:", acc_test*100, '%')

	def __scaled_row(self, row):
		return np.array([(row[k] - self.mean[k])/self.scale[k] for k in range(row.shape[0])])

	def run_model(self, sample):
		sample = self.__scaled_row(sample)
		if (not self.model):
			raise ModelError("Train Model First")
			
		result = self.model.predict_proba(sample.reshape(1, -1))
		self.model_calls += 1
		return result[0][1]

	def run_model_data(self, data_set):
		if (not self.model):
			raise ModelError("Train Model First")

		for i in range(data_set.shape[0]):
			data_set[i] = self.__scaled_row(data_set[i])

		pred = self.model.predict(data_set)
		self.model_calls += data_set.shape[0]
		return pred

	def run_model_data_prob(self, data_set):
		if (not self.model):
			raise ModelError("Train Model First")

		for i in range(data_set.shape[0]):
			data_set[i] = self.__scaled_row(data_set[i])

		pred = self.model.predict_proba(data_set)
		self.model_calls += data_set.shape[0]
		return pred

class SVM_model(ML_model):
	def train_model(self, c_val=1):
		self.model = svm.SVC(kernel='linear', C=c_val, probability=True, random_state=self.rand_state)
		self.model.fit(self.X_tr,self.y_tr.reshape(self.y_tr.shape[0],))

class RF_model(ML_model):
	def train_model(self, n_estimators=100):
		self.model = RandomForestClassifier(n_estimators=n_estimators, random_state=self.rand_state)
		self.model.fit(self.X_tr,self.y_tr.reshape(self.y_tr.shape[0],))

class LogR_model(ML_model):
	def train_model(self):
		self.model = LogisticRegression(random_state=self.rand_state)
		self.model.fit(self.X_tr,self.y_tr.reshape(self.y_tr.shape[0],))

# Wrapper for the R model for calling just as Python model
class R_model():
	def __init__ (self, single_p, multiple_p, multiple_c):
		self.single_p = single_p
		self.multiple_p = multiple_p
		self.multiple_c = multiple_c
		self.model_calls = 0
		print("success building R model")

	# Modifies the global variable curr_rows and calls R function
	# https://stackoverflow.com/a/142601
	def run_model(self, sample):
		parent.curr_rows = sample
		self.model_calls += 1
		return self.single_p()
  	
	def run_model_data(self, data_set):
		parent.curr_rows = data_set
		self.model_calls += data_set.shape[0]
		return np.array(self.multiple_c()).astype(int)

	def run_model_data_prob(self, data_set):
		parent.curr_rows = data_set
		self.model_calls += data_set.shape[0]
		return self.multiple_p()
		
	

