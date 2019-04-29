import pandas as pd
import numpy as np
from Functions import *

def populate_violin_plot(pos_array, id_list, monot=False):

    names = ["External Risk Estimate", 
                      "Months Since Oldest Trade Open",
                      "Months Since Last Trade Open",
                      "Average Months in File",
                      "Satisfactory Trades",
                      "Trades 60+ Ever",
                      "Trades 90+ Ever",
                      "% Trades Never Delq.",
                      "Months Since Last Delq.",
                      "Max Delq. Last 12M",
                      "Max Delq. Ever",
                      "Total Trades",
                      "Trades Open Last 12M",
                      "% Installment Trades",
                      "Months Since Most Recent Inq",
                      "Inq Last 6 Months",
                      "Inq Last 6 Months exl. 7 days",
                      "Revolving Burden",
                      "Installment Burden",
                      "Revolving Trades w/ Balance:",
                      "Installment Trades w/ Balance",
                      "Bank Trades w/ High Utilization Ratio",
                      "% Trades w/ Balance"]

    monot_array = np.array([1,1,1,1,1,0,0,1,1,1,1,-1,0,-1,1,0,0,0,0,-1,-1,0,-1])

    all_graphs = []

    total_length = pos_array.shape[0]
    id_length = id_list.shape[0]

    for col in range(pos_array.shape[1]):

        # -- Creating 10 empty dictionaries -- 
        single_graph = []

        for i in range(10):
            single_graph.append({'bin':str(i+1), "left":0, "right":0})

        
        # -- Incramenting total counts --
        column = pos_array[:,col]

        for bin_no in column:
            single_graph[int(bin_no)]['right'] += 1


        # -- Incramenting relative counts -- 
        for id_no in id_list:
            to_incrament = column[id_no-1]
            single_graph[int(to_incrament)]['left'] += 1  # assuming 1 indexing


        # print(single_graph)
        all_graphs.append(single_graph)

    return all_graphs


if __name__ == '__main__':
    vals = pd.read_csv("static/data/final_data_file.csv", header=None).values
    X = vals[:,1:]
    y = vals[:,0]

    vals_no_9 = prepare_for_analysis("static/data/final_data_file.csv")
    X_no_9 = vals_no_9[:,1:]

    no_samples, no_features = X.shape


    bins_centred, X_pos_array, init_vals = divide_data_bins(X_no_9,[9,10])
    # density_array = scaling_data_density(X_no_9, bins_centred)
    # print(len(density_array))


    result = populate_violin_plot(X_pos_array, np.array([1,2,3,4,5,6,7]))
    print(result.shape)
    # count_total = occurance_counter("static/data/pred_data_x.csv")
    # sample_transf()