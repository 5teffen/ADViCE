import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
from bokeh.layouts import row, gridplot, layout
from bokeh.models import CustomJS, ColumnDataSource, HoverTool, TapTool, WheelZoomTool, LassoSelectTool, BoxSelectTool, PanTool, HelpTool
from bokeh.plotting import figure, output_file, show
from bokeh.resources import CDN
from bokeh.embed import file_html
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


def show_projection(alg, selected_ids):#pre_proc_file,all_data_file,bins_centred,positions,transform):

    filename = "static/data/anchs_PCA.csv"
    title="2D Projection - Anchors"

    if (not alg):
        filename = "static/data/changes_PCA.csv"
        title="2D Projection - Changes"

    fp = open(filename, 'r', encoding='utf-8')

    samples = 3114 #7468


    X = np.zeros((samples,2))
    ids = []
    category = []
    selected = []

    for i in range(samples):

        roww = fp.readline().split(',')

        # print(roww)

        ids.append(roww[0])
        X[i][0] = float(roww[3])
        X[i][1] = float(roww[4])

        if i in selected_ids:
            selected.append(1)
        else:
            selected.append(0)

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

        color_opt = ["green", "red", "darkgreen", "darkred", "gray"]
        alpha_opt = [0.6, 0.05]
        if (len(selected)>0):
            alpha_opt = [0.7, 0.02]
        colors = []
        fill_alpha = []
        line_alpha = []

        for k in range(samples):
            if selected[k]:
                colors.append(color_opt[category[k]])
                fill_alpha.append(alpha_opt[0])
                line_alpha.append(alpha_opt[0])
            else:
                colors.append(color_opt[-1])
                fill_alpha.append(alpha_opt[1])
                line_alpha.append(alpha_opt[1])


        output_file('2d_changes_map.html')

        s1 = ColumnDataSource(data=dict(x=x, y=y, desc=ids, colors = colors, fill_alpha=fill_alpha, line_alpha = line_alpha))
        
        hover = HoverTool(tooltips=""" """)
        taptoolcallback = CustomJS(args=dict(source=s1),code = """    """)
        tap = TapTool(callback = taptoolcallback)
        boxtoolcallback = CustomJS(args=dict(source=s1),code = """  """)
        box = BoxSelectTool(callback = boxtoolcallback)
        help_b = HelpTool(help_tooltip = """    """)
        wheel_zoom = WheelZoomTool()
        lasso_select = LassoSelectTool()

        p1 = figure(tools=[hover, lasso_select, "reset", tap, wheel_zoom, box, "pan", help_b],
                    toolbar_location="right", toolbar_sticky=False, title=title, width = 390, height = 340)
        p1.circle('x', 'y', source=s1, size=7.3, fill_alpha = 'fill_alpha', line_alpha = 'line_alpha', fill_color = 'colors', line_color = 'colors')
        p1.title.text_font_size = '10pt'
        p1.title.align = 'center'
        p1.toolbar.active_scroll = wheel_zoom
        p1.toolbar.active_drag = lasso_select
        p1.axis.visible = False

        lasso_select.select_every_mousemove = False

        s1.callback = CustomJS( code="""

            var lasso_ids = cb_obj.selected['1d'].indices;
            console.log(lasso_ids);
            parent.makeBokehRequest(lasso_ids);

         """)



        grid = gridplot([[p1, None]], merge_tools=False)

        # show(grid)

        html = file_html(grid, CDN, "my_plot")
        html = html.replace("auto;", "0px;")

        fp = open("static/html/projection_file_raw.html", 'w')
        fp.write(html)
        fp.close()



# False = changes, True = key ftss
# show_projection("")