import numpy as np
import pandas as pd
from bokeh.layouts import gridplot, column
from bokeh.models import CustomJS, ColumnDataSource, HoverTool, TapTool, WheelZoomTool, LassoSelectTool, BoxSelectTool, PanTool, HelpTool, CustomJSFilter, CDSView
from bokeh.plotting import figure, output_file, show
from bokeh.models.widgets import CheckboxGroup
from bokeh.resources import CDN
from bokeh.embed import file_html


def show_projection(filename, total_samples, algorithm=True, selected_ids=None, dim_red="PCA", directionality=True):

    title = "Space of counterfactuals"
    # print(selected_ids)

    # filename += dim_red

    # if (not directionality):
    #     filename += "_dir_False"

    # filename += ".csv"

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
    category = []
    for i in range(samples):
        if df[i][2] == "TP":
            category.append(0)
        elif df[i][2] == "TN":
            category.append(1)
        elif df[i][2] == "FP":
            category.append(2)
        elif df[i][2] == "FN":
            category.append(3)
    category = np.array(category)

    # print(X)
    # print(ids)
    # print(ft_selected_ids)
    # print(category)

    for p in range(1,2):

        x = X[:,0]
        y = X[:,1]

        # --- Bokeh ---

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


        s1 = ColumnDataSource(data=dict(x=x, y=y, ids=ids, category=category, colors = colors, fill_alpha=fill_alpha, line_alpha = line_alpha, line_color=line_color, ft_selected_ids=ft_selected_ids))
        
        wheel_zoom = WheelZoomTool()
        lasso_select = LassoSelectTool()

        taptoolcallback = CustomJS(args=dict(source=s1),code = """

        var ids = source.data['ids'];
        var inds = source['selected']['1d'].indices;
        console.log(ids);
        console.log(inds);
        var sample = ids[inds[0]];
        var reloc = window.location.origin + "/individual?sample=" + sample;
        console.log(reloc);
        parent.window.location.href = reloc;        
        
        """)
        tap = TapTool(callback = taptoolcallback)

        p1 = figure(tools=[lasso_select, "reset", tap, wheel_zoom, "pan"],
                    toolbar_location="right", toolbar_sticky=False, title=title, width = 390, height = 390)
        
        p1.title.text_font_size = '10pt'
        p1.title.align = 'center'
        p1.toolbar.active_scroll = wheel_zoom
        p1.toolbar.active_drag = lasso_select
        p1.axis.visible = False

        lasso_select.select_every_mousemove = False

        # CheckboxGroup to select categories
        # category_selection = CheckboxGroup(labels=["TP", "TN", "FP", "FN"], active = [0, 1, 2, 3])

        # selection_callback = CustomJS(args=dict(source=s1), code="""
        #     source.change.emit();
        # """)
        # category_selection.js_on_change('active', selection_callback)

        # # Define the custom filter to return the indices, compare against values in source.data
        # js_filter = CustomJSFilter(args=dict(category_selection=category_selection, source=s1), code="""
        #         var indices = [];
        #         for (var i = 0; i <= source.data['category'].length; i++){
        #             if (category_selection.active.includes(source.data['category'][i])) {
        #                 indices.push(i)
        #             }
        #         }
        #         return indices;
        #         """)

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
        view = CDSView(source=s1)#, filters=[js_filter])
        p1.circle('x', 'y', source=s1, view=view, size=7.3, fill_alpha = 'fill_alpha', line_alpha = 'line_alpha', fill_color = 'colors', line_color = 'line_color',
                   nonselection_fill_alpha=alpha_opt[-1],
                   nonselection_fill_color=color_opt[-1],
                   nonselection_line_color=color_opt[-1],
                   nonselection_line_alpha=alpha_opt[-1] 
                  )

        layout = column(p1)#, category_selection)

        html = file_html(layout, CDN, "my_plot")
        html = html.replace("auto;", "0px;")

        fp = open("static/html/projection_file_raw.html", 'w')
        fp.write(html)
        fp.close()

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


        # var lasso_ids = cb_obj.selected['1d'].indices;
        # //console.log(lasso_ids);
        # var ft_selected_ids = cb_obj.data['ft_selected_ids'];
        # var ids = cb_obj.data['ids'];
        # //console.log(ft_selected_ids);

        # var aggregation_ids = [];

        # for (i=0; i<ft_selected_ids.length; i++){
        #     if (ft_selected_ids[i] == 1 && lasso_ids.includes(i)){
        #         //console.log(ids[i]);
        #         aggregation_ids.push(ids[i]);
        #     }
        # }

        # if (!(aggregation_ids && aggregation_ids.length)) {
        #     aggregation_ids = [-1];
        # }

        # console.log(aggregation_ids);
        # //parent.makeBokehRequest(aggregation_ids);
        # parent.makeBokehRequest2(aggregation_ids);

     

if __name__ == '__main__':

    show_projection('static/data/diabetes_changes_proj_PCA.csv', 768)