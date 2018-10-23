import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
from bokeh.layouts import row, gridplot, layout
from bokeh.models import CustomJS, ColumnDataSource, HoverTool, TapTool, WheelZoomTool, LassoSelectTool, BoxSelectTool, PanTool, HelpTool
from bokeh.plotting import figure, output_file, show
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


filename = 'static/data/changes_PCA.csv'
fp = open(filename, 'r', encoding='utf-8')

samples = 3114 #7468


X = np.zeros((samples,2))
ids = []
category = []

for i in range(samples):

    roww = fp.readline().split(',')

    # print(roww)

    ids.append(roww[0])
    X[i][0] = float(roww[3])
    X[i][1] = float(roww[4])

    if roww[2] == "TP":
        category.append(0)
    elif roww[2] == "TN":
        category.append(1)
    elif roww[2] == "FP":
        category.append(2)
    elif roww[2] == "FN":
        category.append(3)
    # percentage.append(float(roww[4]))


for p in range(1,2):

    x = []
    y = []
    for i in range (samples):
        x.append(X[i][0])
        y.append(X[i][1])


    #################
    #################
    ##### bokeh #####
    #################
    #################

    color_opt = ["blue", "red", "green", "yellow"]

    colors = []
    for k in range(samples):
        colors.append(color_opt[category[k]])


    output_file('2d_changes_map.html')

    s1 = ColumnDataSource(data=dict(x=x, y=y, desc=ids, colors = colors))
    
    hover = HoverTool(tooltips=""" """)
    taptoolcallback = CustomJS(args=dict(source=s1),code = """    """)
    tap = TapTool(callback = taptoolcallback)
    boxtoolcallback = CustomJS(args=dict(source=s1),code = """  """)
    box = BoxSelectTool(callback = boxtoolcallback)
    help_b = HelpTool(help_tooltip = """    """)
    wheel_zoom = WheelZoomTool()
    lasso_select = LassoSelectTool()

    p2 = figure(width = 700, height = 700)
    p1 = figure(tools=[hover, lasso_select, "reset", tap, wheel_zoom, box, "pan", help_b], toolbar_location="right", toolbar_sticky=False, title="FICO Challenge - Changes", width = 700, height = 700)
    p1.circle('x', 'y', source=s1, size=7.3, fill_alpha = 0.5, fill_color = 'colors', line_color = 'colors')
    p1.title.text_font_size = '12pt'
    p1.title.align = 'center'
    p1.toolbar.active_scroll = wheel_zoom
    p1.toolbar.active_drag = lasso_select


    grid = gridplot([[p1, None]], merge_tools=False)

    show(grid)

