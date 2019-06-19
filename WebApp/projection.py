import numpy as np
from bokeh.layouts import gridplot, column
from bokeh.models import CustomJS, ColumnDataSource, HoverTool, TapTool, WheelZoomTool, LassoSelectTool, BoxSelectTool, PanTool, HelpTool, CustomJSFilter, CDSView
from bokeh.plotting import figure, output_file, show
from bokeh.models.widgets import CheckboxGroup
from bokeh.resources import CDN
from bokeh.embed import file_html


def show_projection(alg, selected_ids, dim_red, directionality):

    filename = "static/data/anchs_"
    title = "2D Projection - Key Features"
    samples = 7468
    if (not alg):
        samples = 3114
        filename = "static/data/changes_"
        title = "2D Projection - Changes"

    filename += dim_red

    if (not directionality):
        filename += "_dir_False"

    filename += ".csv"

    fp = open(filename, 'r', encoding='utf-8')

    X = np.zeros((samples,2))
    ids = []
    category = []
    ft_selected_ids = []

    for i in range(samples):

        roww = fp.readline().split(',')

        # print(roww)

        ids.append(int(roww[0]))
        X[i][0] = float(roww[3])
        X[i][1] = float(roww[4])

        if int(roww[0]) in selected_ids:
            ft_selected_ids.append(1)
        else:
            ft_selected_ids.append(0)

        if roww[2] == "TP":
            category.append(0)
        elif roww[2] == "TN":
            category.append(1)
        elif roww[2] == "FP":
            category.append(2)
        elif roww[2] == "FN":
            category.append(3)
        # percentage.append(float(roww[4]))
    fp.close()


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

        color_opt = ["rgb(27, 158, 119)", "rgb(217, 95, 2)", "rgb(27, 158, 119)", "rgb(217, 95, 2)", "gray"]
        alpha_opt = [0.6, 0.05]
        line_opt = ["rgb(27, 158, 119)", "rgb(217, 95, 2)", "black", "black", "gray"]
        if (len(ft_selected_ids)>0):
            alpha_opt = [0.7, 0.02]
        colors = []
        line_color = []
        fill_alpha = []
        line_alpha = []

        for k in range(samples):
            if ft_selected_ids[k]:
                colors.append(color_opt[category[k]])
                line_color.append(line_opt[category[k]])
                fill_alpha.append(alpha_opt[0])
                line_alpha.append(alpha_opt[0])
            else:
                colors.append(color_opt[-1])
                line_color.append(line_opt[-1])
                fill_alpha.append(alpha_opt[-1])
                line_alpha.append(alpha_opt[-1])


        output_file('2d_changes_map.html')

        s1 = ColumnDataSource(data=dict(x=x, y=y, ids=ids, category=category, colors = colors, fill_alpha=fill_alpha, line_alpha = line_alpha, line_color=line_color, ft_selected_ids=ft_selected_ids))
        
        hover = HoverTool(tooltips=""" """)
        # help_b = HelpTool(help_tooltip = """    """)
        wheel_zoom = WheelZoomTool()
        lasso_select = LassoSelectTool()

        p1 = figure(tools=[hover, lasso_select, "reset", "tap", wheel_zoom, "pan"],
                    toolbar_location="right", toolbar_sticky=False, title=title, width = 390, height = 390)
        # p1.circle('x', 'y', source=s1, size=7.3, fill_alpha = 'fill_alpha', line_alpha = 'line_alpha', fill_color = 'colors', line_color = 'line_color',
        #            nonselection_fill_alpha=alpha_opt[-1],
        #            nonselection_fill_color=color_opt[-1],
        #            nonselection_line_color=color_opt[-1],
        #            nonselection_line_alpha=alpha_opt[-1] 
        #           )

        p1.title.text_font_size = '10pt'
        p1.title.align = 'center'
        p1.toolbar.active_scroll = wheel_zoom
        p1.toolbar.active_drag = lasso_select
        p1.axis.visible = False

        lasso_select.select_every_mousemove = False

        # CheckboxGroup to select categories
        category_selection = CheckboxGroup(labels=["TP", "TN", "FP", "FN"], active = [0, 1, 2, 3])

        selection_callback = CustomJS(args=dict(source=s1), code="""
            source.change.emit();
        """)
        category_selection.js_on_change('active', selection_callback)

        # Define the custom filter to return the indices, compare against values in source.data
        js_filter = CustomJSFilter(args=dict(category_selection=category_selection, source=s1), code="""
                var indices = [];
                for (var i = 0; i <= source.data['category'].length; i++){
                    if (category_selection.active.includes(source.data['category'][i])) {
                        indices.push(i)
                    }
                }
                return indices;
                """)

        s1.callback = CustomJS( code="""

            var lasso_ids = cb_obj.selected['1d'].indices;
            //console.log(lasso_ids);
            var ft_selected_ids = cb_obj.data['ft_selected_ids'];
            var ids = cb_obj.data['ids'];
            //console.log(ft_selected_ids);

            var aggregation_ids = [];

            for (i=0; i<ft_selected_ids.length; i++){
                if (ft_selected_ids[i] == 1 && lasso_ids.includes(i)){
                    //console.log(ids[i]);
                    aggregation_ids.push(ids[i]);
                }
            }

            if (!(aggregation_ids && aggregation_ids.length)) {
                aggregation_ids = [-1];
            }

            console.log(aggregation_ids);
            //parent.makeBokehRequest(aggregation_ids);
            parent.makeBokehRequest2(aggregation_ids);

         """)

        # Use the filter in a view
        view = CDSView(source=s1, filters=[js_filter])
        p1.circle('x', 'y', source=s1, view=view, size=7.3, fill_alpha = 'fill_alpha', line_alpha = 'line_alpha', fill_color = 'colors', line_color = 'line_color',
                   nonselection_fill_alpha=alpha_opt[-1],
                   nonselection_fill_color=color_opt[-1],
                   nonselection_line_color=color_opt[-1],
                   nonselection_line_alpha=alpha_opt[-1] 
                  )

        layout = column(p1, category_selection)

        # show(layout)

        # grid = gridplot([[p1, None]], merge_tools=False)

        # # show(grid)

        html = file_html(layout, CDN, "my_plot")
        html = html.replace("auto;", "0px;")

        fp = open("static/html/projection_file_raw.html", 'w')
        fp.write(html)
        fp.close()

# show_projection(False, list(range(7468)), "pca", True )