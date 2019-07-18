import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
from bokeh.layouts import row
from bokeh.models import CustomJS, ColumnDataSource, HoverTool, TapTool, WheelZoomTool, LassoSelectTool, BoxSelectTool, PanTool, HelpTool
from bokeh.plotting import figure, output_file, show
from sklearn.cluster import KMeans

def get_artist(name):

	## Clips

	if (name[2] == 'C'):

		if ('Compilations' in name):
			start = name.find('tions') + 6
			end = name[start:].find('/')
			return name[start:start+end]

		elif ('new_collection' in name):
			start = name.find('FF') + 3
			end = name[start:].find('/')
			return name[start:start+end]

		elif ('Various Artists' in name):
			start = name.find('Artists') + 8
			end = name[start:].find('/')
			return name[start:start+end]

		else:
			start = 8
			end = name[start:].find('/')
			return name[start:start+end]


	else:

		## EastAfricanClips

		if ('from Jamal' in name):
			start = name.find('Hafidh') + 7
			end = name[start:].find('/')
			return "EAST AFRICAN " + name[start:start+end]

		elif ('from Prahbo' in name):
			start = name.find('Patel') + 6
			end = name[start:].find('/')
			return "EAST AFRICAN " + name[start:start+end]

		elif ('Bonzo &' in name):
			return "EAST AFRICAN " + 'Bonzo & Party'

		elif ('Zein Musical Party' in name):
			return "EAST AFRICAN " + 'Zein Musical Party Vol 10'

		# elif ('Emma' in name):
		# 	start = name.find('Emma') + 5
		# 	print (start)
		# 	end = name[start:].find('/')
		# 	return name[start:start+end]

		else:
			start = name.find('Emma') + 6
			end = name[start:].find('/')
			return "EAST AFRICAN " + name[start:start+end]

filename = 'MFCC_Merged_Repaired_All_v2.csv'
fp = open(filename, 'r', encoding='utf-8')

samples = 2792 
features = 2627

X = np.zeros((samples,features))
names = []
artists = []
proper_names = []
display_names = []

roww = fp.readline().split(',')
for i in range(samples+1): #add one for break

    roww = fp.readline().split(',')

    if(len(roww)>3):
    	names.append(roww[0])
    	artists.append(get_artist(roww[0]))
    	for j in range (features):
    		try:
    			v = float(roww[j+1])
    			X[i][j] = v
    		except:
    			break

print(len(names))

for i in range(samples):
    proper_names.append(names[i].replace("~",","))
    cnt = 0
    for j in range(len(proper_names[i])):
        if proper_names[i][j] == "/":
            cnt = j
    display_names.append(proper_names[i][cnt+1:])

print('initial reading done')
fp.close()



####### KMeans #######
min_inertia = 10**20
fk = 6
labels = []
xp = range(1,20)
yp = []
for k in [6]:
    kmeans = KMeans(n_clusters=k, random_state=0).fit(X)
    tlabels = kmeans.labels_
    inertia = kmeans.inertia_
    yp.append(inertia)
    print (k, inertia)
    if inertia < min_inertia:
        min_inertia = inertia
        fk = k
        labels = tlabels
print('kmeans done', fk, "clusters")
# plt.plot(xp, yp)
# plt.show()
######################


################# Fast initial reading #########################
# filename = '2d_Merged_Repaired_no_dups_mfcc_tsne_prx_10_l-rate_2000_try_6_v2.csv'
# fp = open(filename, 'r', encoding='utf-8')
# samples = 2792 
# names = []
# artists = []
# proper_names = []
# display_names = []
# for i in range(samples): #add one for break
#     roww = fp.readline().split(',')
#     names.append(roww[0])
#     artists.append(get_artist(roww[0]))
# print(len(names))
# for i in range(samples):
#     proper_names.append(names[i].replace("~",","))
#     cnt = 0
#     for j in range(len(proper_names[i])):
#         if proper_names[i][j] == "/":
#             cnt = j
#     display_names.append(proper_names[i][cnt+1:])
# print('initial reading done')
# fp.close()
################################################################


newartists = list(set(artists))
newartists.sort()

for p in range(1,2):

    prx = 10
    l_rate = 2000

    # model = TSNE(n_components=2, perplexity=prx, learning_rate=l_rate)#, init='pca'
    # np.set_printoptions(suppress=True)
    # T = model.fit_transform(X)
    # print (T.shape)
    # print (model.kl_divergence_)

    # fp = open('check2d_Merged_Repaired_no_dups_mfcc_tsne_prx_' + str(prx) + '_l-rate_' + str(l_rate) + '_try_' + str(p) +'_v2.csv', 'w', encoding='utf-8')
    # x = []
    # y = []
    # for i in range (samples):
    #     fp.write(names[i])
    #     fp.write(',')
    #     x.append(T[i][0])
    #     y.append(T[i][1])
    #     fp.write(str(T[i][0]))
    #     fp.write(',')
    #     fp.write(str(T[i][1]))
    #     fp.write('\n')

    # fp.close()

    fp = open('check2d_Merged_Repaired_no_dups_mfcc_tsne_prx_' + str(prx) + '_l-rate_' + str(l_rate) + '_try_' + str(p) +'_v2.csv', 'r', encoding='utf-8')
    x = []
    y = []

    for i in range(samples):
        roww = fp.readline().split(',')
        w = (float(roww[1]))
        z = (float(roww[2]))
        x.append(w)
        y.append(z)

    fp.close()


    #################
    #################
    ##### bokeh #####
    #################
    #################

    color_opt = ["olive", "darkred", "goldenrod", "skyblue", "red", "darkblue", "gray", "indigo", "black"]

    images = []
    colors = []
    for k in range(len(proper_names)):
        images.append('Cover.jpg')
        colors.append(color_opt[labels[k]])



    output_file('check2d_Merged_Repaired_no_dups_mfcc_tsne_prx_' + str(prx) + '_l-rate_' + str(l_rate) + '_try_' + str(p) +'_v2_newstuff2.html')

    s1 = ColumnDataSource(data=dict(x=x, y=y, desc=proper_names, arts=artists, imgs = images, dsp = display_names, colors = colors))

    hover = HoverTool( tooltips="""
        <div>
            <img
                src="@imgs" height="120" alt="@imgs" width="120" style="display: block; margin-left: auto; margin-right: auto;"
                border="2"
            ></img>
        </div>
        <div>
            <p align="center">@dsp</p>
        </div>
        <div>
            <audio
                src="@desc" height="20" width="20" autoplay 
                border="2"
            ></audio>
        </div>
        """
    )

    # hover = HoverTool(
    #     tooltips=[
    #         ("(x,y)", "($x, $y)"),
    #         ("desc", "@desc"),
    #     ], callback = (hovertoolcallback)
    # )

    taptoolcallback = CustomJS(args=dict(source=s1),code = """

    	var names = source.data['desc'];
    	
        var inds = source['selected']['1d'].indices;

        for (i=0; i<inds.length; i++){

            var title = names[inds[i]];
            title = title.slice(2,);

            var para = document.createElement("p");
            var node = document.createTextNode(title);
            para.appendChild(node);
            document.body.appendChild(para);

            var x = document.createElement("AUDIO");
            var song = String(title);
            x.setAttribute("src",song);
            x.setAttribute("controls", "controls");

            document.body.appendChild(x);

            var para2 = document.createElement("br");
            document.body.appendChild(para2);

        }
        
        
    """)

    tap = TapTool(callback = taptoolcallback)

    boxtoolcallback = CustomJS(args=dict(source=s1),code = """

        var names = source.data['desc'];
        
        var inds = source['selected']['1d'].indices;

        for (i=0; i<inds.length; i++){

            var title = names[inds[i]];
            title = title.slice(2,);

            var para = document.createElement("p");
            var node = document.createTextNode(title);
            para.appendChild(node);
            document.body.appendChild(para);

            var x = document.createElement("AUDIO");
            var song = String(title);
            x.setAttribute("src",song);
            x.setAttribute("controls", "controls");

            document.body.appendChild(x);

            var para2 = document.createElement("br");
            document.body.appendChild(para2);

        }
        
        
    """)

    box = BoxSelectTool(callback = boxtoolcallback)

    help_b = HelpTool(help_tooltip = """
        Button fuctions:

        Click and Drag: Move around plot
        Lasso Select: View plot of artists in selection
        Box Select: Listen to all songs in selection
        Wheel Zoom: Resize plot
        Tap: Listen to all overlaping songs
        Hover: Listen, view album cover and title
        Reset
        """
    )

    wheel_zoom = WheelZoomTool()

    p1 = figure(tools=[hover, "lasso_select", "reset", tap, wheel_zoom, box, "pan", help_b], title="Music Collections", width = 700, height = 700)
    p1.circle('x', 'y', source=s1, size=7.3, fill_alpha = 0.5, fill_color = 'colors', line_color = 'colors')
    p1.title.text_font_size = '12pt'
    p1.title.align = 'center'
    p1.toolbar.active_scroll = wheel_zoom


    s2 = ColumnDataSource(data=dict(artists=[], counts=[], full_artists=[], full_counts=[]))


    s1.callback = CustomJS(args=dict(s2=s2), code="""

    	console.log(cb_obj);

        var inds = cb_obj.selected['1d'].indices;
        var d1 = cb_obj.data;
        var d2 = s2.data;
        d2['full_artists'] = [];
        d2['full_counts'] = [];
        var max_freq = 0;

        for (i=0; i<inds.length; i++){

            var current = d1['arts'][inds[i]];

            if (d2['full_artists'].indexOf(current) == -1){
                d2['full_artists'].push(d1['arts'][inds[i]]);
                d2['full_counts'].push(1);
            }
            else{
                d2['full_counts'][d2['full_artists'].indexOf(current)] += 1;
                if (d2['full_counts'][d2['full_artists'].indexOf(current)] > max_freq){
                	max_freq = d2['full_counts'][d2['full_artists'].indexOf(current)];
                }
            }
            
        }

        console.log(max_freq);

        d2['artists'] = [];
        d2['counts'] = [];
        var thres = max_freq * 0.05;

        //filter arrays to only include freqs >= 5pcnt of max_freq

        for (i=0; i<d2['full_artists'].length; i++){

        	if (d2['full_counts'][i] >= thres){
        		d2['artists'].push(d2['full_artists'][i]);
        		d2['counts'].push(d2['full_counts'][i]);
        	}

        }


        s2.change.emit();

        if (inds.length > 5){


            if (document.getElementById("right_side_style")==null){
                var css = ".right_side div {\\n\\tfont: 12px sans-serif;\\n";
                css = css.concat("\\tbackground-color: white;\\n\\tpadding: 3px;\\n\\tcolor: white;}");
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "right_side_style";
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);
            }

            if (document.getElementById("chart_style")==null){
                var css = ".chart div {\\n\\tfont: 12px sans-serif;\\n";
                css = css.concat("\\tbackground-color: steelblue;\\n\\topacity: 0.8;\\n\\theight: 14px;\\n\\tmargin: 1px;\\n\\twidth: 470px;\\n\\ttext-align: right;\\n\\tcolor: white;}");
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "chart_style";
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);
            }

            if (document.getElementById("artist_style")==null){
                var css = ".artists div {\\n\\tfont: 12px sans-serif;\\n";
                css = css.concat("\\tbackground-color: white;\\n\\theight: 14px;\\n\\tmargin: 1px;\\n\\twidth: 470px;\\n\\ttext-align: right;\\n\\tcolor: black;}");
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "artist_style";
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);
            }

            if (document.getElementById("right_side_div")==null){
                var rightdiv = document.createElement('div');
                rightdiv.className = "right_side";
                rightdiv.style = "float: right; tdisplay: inline-flex; width: 970px;";
                rightdiv.id = "right_side_div";
                document.getElementsByClassName("bk-grid-row bk-layout-fixed")[0].appendChild(rightdiv);
            }
            else{
                document.getElementById("right_side_div").innerHTML = "";
            }

            if (document.getElementById("title_p")==null){
                var para = document.createElement("p");
                var node = document.createTextNode("Artist Frequencies");
                para.className = "title";
                para.style = "text-align: center; font-weight: bold;";
                para.id = "title_p";
                para.appendChild(node);
                document.getElementsByClassName("right_side")[0].appendChild(para);
            }
            else{
                document.getElementById("artists_div").innerHTML = "";
            }

            if (document.getElementById("artists_div")==null){
                var artdiv = document.createElement('div');
                artdiv.className = "artists";
                artdiv.style = "float: left; tdisplay: inline-flex;";
                artdiv.id = "artists_div";
                document.getElementsByClassName("right_side")[0].appendChild(artdiv);
            }
            else{
                document.getElementById("artists_div").innerHTML = "";
            }

            if (document.getElementById("chart_div")==null){
                var chartdiv = document.createElement('div');
                chartdiv.className = "chart";
                chartdiv.style = "float: right; tdisplay: inline-flex;";
                chartdiv.id = "chart_div";
                document.getElementsByClassName("right_side")[0].appendChild(chartdiv);
            }
            else{
                document.getElementById("chart_div").innerHTML = "";
            }


            if (document.getElementById("source_d3js")==null){
                var d3js = document.createElement('script');
                d3js.src = "https://d3js.org/d3.v3.min.js";
                d3js.id = "source_d3js";
                document.body.appendChild(d3js);
            }


            if (document.getElementById("mycode")==null){
                var code_div = document.createElement('script');
                code_div.id = "mycode";
                document.body.appendChild(code_div);
            }

            //populate var data with d2["counts"] and var art_names with d2["artists"]

            var string = "[";

            for (j=0; j<d2['counts'].length-1; j++){
            	var tmp = d2['counts'][j];
                string = string.concat(tmp);
                string += ", ";
            }
            
            var tmp = d2['counts'][d2['counts'].length-1];
            string = string.concat(tmp);
            string += "]";


            var string1 = "[\\"";

            for (j=0; j<d2['artists'].length-1; j++){
                var tmp = d2['artists'][j];
                string1 = string1.concat(tmp);
                string1 = string1.concat("\\"")
                string1 += ", \\"";
            }
            
            var tmp = d2['artists'][d2['artists'].length-1];
            string1 = string1.concat(tmp);
            string1 += "\\"]";


            var d3js_code = "var data = ";
            d3js_code = d3js_code.concat(string);
            d3js_code = d3js_code + ";\\n\\n";

            d3js_code = d3js_code+ "var art_names = ";
            d3js_code = d3js_code.concat(string1);
            d3js_code = d3js_code + ";\\n\\n";


            d3js_code = d3js_code.concat("var x = d3.scale.linear()\\n    .domain([0, d3.max(data)])\\n    .range([0, 470]);\\n\\n");
            //    var x = d3.scale.linear()
            //        .domain([0, d3.max(data)])
            //        .range([0, 420]);

            
            d3js_code = d3js_code.concat("d3.select(\\".chart\\")\\n  .selectAll(\\"div\\")\\n    "+
            ".data(data)\\n  .enter().append(\\"div\\")\\n    "+
            ".style(\\"width\\", function(d) { return x(d) + \\"px\\"; })\\n    .text(function(d) { return d; });");

            //    d3.select(".chart")
            //      .selectAll("div")
            //        .data(data)
            //      .enter().append("div")
            //        .style("width", function(d) { return x(d) + "px"; })
            //        .style("margin", "auto 5px")
            //        .text(function(d) { return d; });";
            //        .class("chartel");


            
            d3js_code = d3js_code.concat("\\n\\nd3.select(\\".artists\\")\\n  .selectAll(\\"div\\")\\n    "+
            ".data(art_names)\\n  .enter().append(\\"div\\")\\n    "+
            ".style(\\"width\\", \\"300\\")\\n    .text(function(d) { return d; });");

            //    d3.select(".artists")
            //      .selectAll("div")
            //        .data(art_names)
            //      .enter().append("div")
            //        .style("width", "300")
            //        .style("margin", "auto 5px")
            //        .text(function(d) { return d; });";
            //        .class("artel");

            document.getElementById("mycode").innerHTML = "";
            document.getElementById("mycode").appendChild(document.createTextNode(d3js_code));


              
            var script = document.getElementById("mycode");
            
            eval(script.innerHTML);


            // Check if chart and script exist
            // if not, create them
            // if they are, change innerhtml for script
            // delete nodes from char and repopulate with new data    

        }

        """)

    # p2.legend.location = "top_left"
    layout = row(p1)#, sizing_mode='scale_height')#, p2)

    show(layout)

