import numpy as np
import pandas as pd
import keras
from keras import optimizers
from keras.models import Model, Sequential
from keras.layers import Dense, Activation

from sklearn.preprocessing import StandardScaler
from Functions import *



class ModelError(Exception):
    pass

class DNN_model():
	def __init__ (self, data, file_name = None):
		if (file_name != None):
			data = prepare_for_analysis(file_name)

		self.model = None

		# -- Seperate --
		self.y = data[:,:1]
		scaler = StandardScaler()
		self.X = scaler.fit_transform(data[:,1:])

		# -- Needs to be retained for inserting new samples
		self.mean = scaler.mean_
		self.scale = scaler.scale_

		self.num_samples , self.num_attributes = self.X.shape

		# -- Split Training/Test -- 
		self.X_tr = self.X[:int(0.8*self.num_samples)]
		self.X_test = self.X[int(0.8*self.num_samples):]


		self.y_tr = self.y[:int(0.8*self.num_samples)]
		self.y_test = self.y[int(0.8*self.num_samples):]


	def train_model(self,c_val=1):
		keras.backend.clear_session()
		nh = 256
		nout = 2

		self.model = Sequential()
		self.model.add(Dense(nh, input_shape=(self.num_attributes,), activation='sigmoid', name='hidden'))
		self.model.add(Dense(nout, activation='softmax', name='output'))

		learning_rate = 0.01
		opt = optimizers.Adam(lr=learning_rate)
		self.model.compile(optimizer=opt, loss='sparse_categorical_crossentropy', metrics=['accuracy'],)

		batch_size = 25
		e = 50
		
		self.model.fit(self.X_tr, self.y_tr, epochs=e, batch_size=batch_size, validation_data=(self.X_test,self.y_test) , verbose=0)


	def test_model(self, X_ts=None, y_ts=None):
		if (not self.model):
			raise ModelError("Train Model First")

		train_pred = self.model.predict(self.X_tr)
		test_pred = self.model.predict(self.X_test)
		train_pred = np.argmax(train_pred, axis=1)
		test_pred = np.argmax(test_pred, axis=1)


		print("Train", train_pred.shape)
		print("Test", test_pred.shape)

		acc_train = round((np.mean(train_pred.reshape(train_pred.shape[0],1) == self.y_tr)* 100),2)
		acc_test = round((np.mean(test_pred.reshape(test_pred.shape[0],1) == self.y_test)* 100),2)

		print("Training Accuracy:", acc_train, '%')
		print("Test Accuracy:", acc_test, '%')

	def __scaled_row(self,row):
	    scld = []
	    for k in range(row.shape[0]):
	        scld.append((row[k] - self.mean[k])/self.scale[k])
	    scld = np.array(scld)
	    
	    return np.array(scld)

	def run_model(self,sample):
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


 

vals = pd.read_csv("static/data/final_data_file.csv", header=None).values
X = vals[:,1:]
y = vals[:,0]

vals_no_9 = prepare_for_analysis("static/data/final_data_file.csv")
X_no_9 = vals_no_9[:,1:]

no_samples, no_features = X.shape

dnn_model = DNN_model(None,"static/data/final_data_file.csv")
dnn_model.train_model(0.001)
dnn_model.test_model()

