import os
import json

import numpy
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
from sklearn.metrics import r2_score

dataArrays = []
IndividualArrays = []
SidesArrays = []


def read_data(fileName, arr):
    path = os.path.join(os.path.dirname(__file__), fileName)
    for filename in os.listdir(path):
        if filename.endswith(".json") or filename.endswith(".js"):
            with open(os.path.join(path, filename)) as dataFile:
                data = dataFile.read()
                stds = json.loads(data)
                arr.append(stds)
        else:
            continue


def func(x, a, b, c):
    return a * numpy.exp(-b * x) + c

def plot_data(arrayList):
    time_array = [*zip(*arrayList)]
    t = range(len(arrayList[0]))
    mean_arr = numpy.asarray([numpy.mean(time_array[i]) for i in t])
    std_arr = np.asarray([numpy.std(time_array[i]) for i in t])

    popt, pcov = curve_fit(func, t, mean_arr)
    fit_arr = func(t, *popt)
    # popt, pcov = curve_fit(func, xdata, ydata, bounds=(0, [3., 1., 0.5]))

    plt.fill_between(t,
                     mean_arr - 2 * std_arr,
                     mean_arr + 2 * std_arr,
                     color=(0.2, 0.95, 0.2),
                     label="$Mean \pm 2 \cdot STD$",
                     alpha=0.1)
    plt.fill_between(t,
                     mean_arr - std_arr,
                     mean_arr + std_arr,
                     color=(0.3, 0.8, 0.3),
                     label="$Mean \pm STD$",
                     alpha=0.4)
    plt.plot(t,
             mean_arr,
             label="Mean",
             color=(0.05, 0.5, 0.05))
    # plt.plot(t,
    #          fit_arr,
    #          "--",
    #          label="${:.2f} \cdot exp(-{:.2f} \cdot x) + {:.2f} \; | \; R^2 = {:.3f}$"
    #          .format(popt[0],
    #                  popt[1],
    #                  popt[2],
    #                  r2_score(mean_arr, fit_arr)),
    #          color=(0, 0, 0))
    """
    anomaly_plots = [arr for arr in arrayList if max(arr[round(len(arr)/2):]) > 1.5]
    t = list(range(3000))
    for index, arr in enumerate(anomaly_plots):
        plt.plot(t,
                 arr,
                 color=(1 - index / len(anomaly_plots), 0, 0),
                 alpha=0.8)
    """
    ax = plt.gca()
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.xlim((0, 20))
    plt.ylim((0, 1.2))
    plt.xticks(np.arange(0, len(t)+1, 5))
    plt.legend()
    plt.xlabel('Time [Frames]')
    plt.ylabel('Correlation')


def main():
    # read_data("Data", dataArrays)
    # read_data("Data-Individuals", IndividualArrays)
    # read_data("SidesData", SidesArrays)
    # plt.figure(1)
    # plot_data(dataArrays)
    # plt.title('Clusters - Influence 0.01 - 40 units')
    # plt.figure(2)
    # plot_data(IndividualArrays)
    # plt.title('Individuals - Influence 0.01 - 40 units')
    # plt.figure(3)
    # plot_data(SidesArrays)
    # plt.title('Clusters with Sides - Influence 0.01 - 40 units')
    # plt.show()

    read_data("space_corrs", dataArrays)
    plot_data(dataArrays)
    plt.title("Space Correlation - Avg. 70 Runs")
    plt.show()

    return 0


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()