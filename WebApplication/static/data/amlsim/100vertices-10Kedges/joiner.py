
import pandas as pd
import numpy as np




if __name__ == '__main__':
	
	# df = pd.read_csv(data_path)

	# # -- Sample with equal targets -- 
	# df0 = df.loc[df['isFraud'] == 0]
	# df0 = df0.sample(n=5000, random_state=1)

	# df1 = df.loc[df['isFraud'] == 1]
	# df1 = df1.sample(n=5000, random_state=1)

	# sampled_df = pd.concat([df0,df1])
	
	# # -- Map categorical to fixed values -- 
	# mymap = {'CASH_IN':1, 'CASH_OUT':2, 'PAYMENT':3, 'TRANSFER':4, 'DEBIT':5}
	# sampled_df = sampled_df.applymap(lambda s: mymap.get(s) if s in mymap else s)


 # 	# -- Remove unique/near-unique features -- 
	# sampled_df = sampled_df.drop(['step', 'nameOrig', 'nameDest'], axis=1)


	# # -- Re-ordering columns (target last) -- 
	# cols = sampled_df.columns.tolist()
	# cols = cols[:-2] + [cols[-1]] + [cols[-2]]
	# sampled_df = sampled_df[cols]
	

	# # -- Export to CSV -- 
	# sampled_df.to_csv("paysim.csv",index=False)

