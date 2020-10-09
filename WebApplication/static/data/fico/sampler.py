
import pandas as pd
import numpy as np




if __name__ == '__main__':
	data_path = "fico.csv"
	sample_no = 300
	
	df = pd.read_csv(data_path)

	
	df = pd.read_csv(data_path)

	# -- Sample with equal targets -- 
	df0 = df.loc[df['RiskPerformance'] == 0]
	df0 = df0.sample(n=300, random_state=1)

	df1 = df.loc[df['RiskPerformance'] == 1]
	df1 = df1.sample(n=300, random_state=1)

	sampled_df = pd.concat([df0,df1])
	

	# -- Export to CSV -- 
	sampled_df.to_csv("fico-new.csv",index=False)

