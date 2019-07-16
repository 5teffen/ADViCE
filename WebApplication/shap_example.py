import sklearn
import shap
import numpy as np
from sklearn.model_selection import train_test_split
from local_importance_plot import plot_local_imp

XX = shap.datasets.iris()
cols = np.array(XX[0].columns)
data = np.array(XX[0].values)
target = np.array(XX[1])

# train a SVM classifier
X_train,X_test,Y_train,Y_test = train_test_split(data, target, test_size=0.2, random_state=0)
svm = sklearn.svm.SVC(kernel='rbf', probability=True)
svm.fit(X_train, Y_train)
print("Training:", svm.score(X_train, Y_train))
print("Testing:", svm.score(X_test, Y_test))

i=10
# use Kernel SHAP to explain test set predictions
explainer = shap.KernelExplainer(svm.predict_proba, data, link="logit")
print(data[i])
shap_values = explainer.shap_values(data[i], nsamples=100)
print(data[i])
print(shap_values)
print(explainer.expected_value[0])
print("Prediction:", svm.predict_proba(data[i].reshape(1, -1)))


# plot the SHAP values for the Setosa output of the first instance
html = shap.force_plot(explainer.expected_value[0], shap_values[0], data[i], link="logit", matplotlib=True)

svg = plot_local_imp(shap_values[0], cols, data[i])
fp = open("shap_example.html", 'w', encoding="utf-8")
fp.write(svg)
fp.close()