import numpy as np
import pandas as pd


def show_projection2(filename, total_samples, algorithm=True, selected_ids=None, dim_red="PCA", directionality=True):

    df = pd.read_csv(filename, header=None)
    df = df.values
    samples = df.shape[0]
    
    if selected_ids == None:
        selected_ids = list(range(1,total_samples+1))

    X = np.zeros((samples,2))
    X[:,0] = df[:,3]
    X[:,1] = df[:,4]
    ids = df[:,0]
    ft_selected_ids = np.array([1 if int(ids[i]) in selected_ids else 0 for i in range(samples)])
    category = df[:,2]

    # print(X)
    # print(ids)
    # print(ft_selected_ids)
    # print(category)

    x = X[:,0]
    y = X[:,1]

    ret_list = []
    for i in range(samples):
        ret_list.append({
            'id': int(ids[i]),
            'x_val': float(x[i]),
            'y_val': float(y[i]),
            'category': str(category[i])
            })

    ranges = [min(x),max(x),min(y),max(y)]
    return [ret_list, ranges]



def full_projection(file_reduced, file_meta):
    # --- Data for dimensionality reduction --- 
    data = pd.read_csv(file_reduced, header=None)
    data = data.values

    # --- Preprocessed metadata for points --- 
    meta = pd.read_csv(file_meta,index_col=False)
    meta = meta.values
    print(meta)

    samples = data.shape[0]
    
    x_vals = data[:,0]
    y_vals = data[:,1]
    ids = meta[:,0]
    percentages = meta[:,1]
    categories = meta[:,2]

    result = []
    for i in range(samples):
        result.append({
            'id': int(ids[i]),
            'x_val': float(x_vals[i]),
            'y_val': float(y_vals[i]),
            'category': str(categories[i]),
            'perc': float(percentages[i])
            })

    return result




if __name__ == '__main__':

    show_projection('static/data/diabetes_changes_proj_PCA.csv', 768)