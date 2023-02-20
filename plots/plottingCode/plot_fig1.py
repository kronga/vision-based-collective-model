import os
import json

import numpy
import numpy as np
import matplotlib

# matplotlib.rcParams['text.usetex'] = True
import matplotlib.pyplot as plt
from main import read_data
from scipy.stats import sem



def func(x, a, b, c):
    return a * numpy.exp(-b * x) + c


def plot_data_multi():
    font = {'size': 18}
    plt.rc('font', **font)
    raw_data = []
    array40 = []
    array60 = []
    array80 = []
    array100 = []
    array120 = []

    read_data("C:/Users/cokron/Desktop/David Robotics/figure_1", raw_data)
    # # read_data("Run Data\\Extrapolating\\Radius 40\\40", array40)
    # read_data("Run Data\\Ignoring\\Radius 40\\60", array60)
    # # read_data("Run Data\\Extrapolating\\Radius 40\\80", array80)
    # # read_data("Run Data\\Extrapolating\\Radius 40\\100", array100)
    # read_data("Run Data\\Ignoring\\Radius 40\\120", array120)

    t = range(len(raw_data[0]))

    # def mean_arr(array):
    #     transformed_arr = [*zip(*array)]
    #     return numpy.asarray([numpy.mean(transformed_arr[i]) for i in t]), \
    #            numpy.asarray([numpy.std(transformed_arr[i]) for i in t])

    def mean_arr(array):
        t = range(len(array[0]))
        transformed_arr = [*zip(*array)]
        return np.asarray([np.mean(transformed_arr[i]) for i in t]), \
               np.asarray([sem(transformed_arr[i]) for i in t]),

    mean, std = mean_arr(raw_data)
    # # mean_40 = mean_arr(array40)
    # mean_60, std_60 = mean_arr(array60)
    # # mean_80 = mean_arr(array80)
    # # mean_100 = mean_arr(array100)
    # mean_120, std_120 = mean_arr(array120)

    # popt, pcov = curve_fit(func, t, mean_arr)
    # fit_arr = func(t, *popt)
    # popt, pcov = curve_fit(func, xdata, ydata, bounds=(0, [3., 1., 0.5]))

    # plt.fill_between(t,
    #                  mean_arr - 2 * std_arr,
    #                  mean_arr + 2 * std_arr,
    #                  color=(0.2, 0.95, 0.2),
    #                  label="$Mean \pm 2 \cdot STD$",
    #                  alpha=0.1)
    plt.fill_between(t,
                     mean - std,
                     mean + std,
                     color='g',
                     # label="$\pm STD$",
                     alpha=0.1)
    # plt.fill_between(t,
    #                  mean_60 - std_60,
    #                  mean_60 + std_60,
    #                  color='b',
    #                  label="$Mean60 \pm STD$",
    #                  alpha=0.1)
    # plt.fill_between(t,
    #                  mean_120 - std_120,
    #                  mean_120 + std_120,
    #                  color='g',
    #                  label="$Mean120 \pm STD$",
    #                  alpha=0.1)
    # plt.plot(t,
    #          data_mean,
    #          label="10",
    #          color='r')
    plt.plot(t,
             mean,
             label="Polarization Mean",
             # label="$\num{5.75e-5} \frac{unit}{pixel^2}$",
             color='g')
    # # plt.plot(t,
    # #          mean_40,
    # #          label="40",
    # #          color='b')
    # plt.plot(t,
    #          mean_60,
    #          label="1.72E-4 [Unit/Pixel^2]",
    #          color='b')
    # plt.plot(t,
    #          mean_80,
    #          label="80",
    #          color='m')
    # plt.plot(t,
    #          mean_100,
    #          label="100",
    #          color='y')
    # plt.plot(t,
    #          mean_120,
    #          label="3.45E-4 [Unit/Pixel^2]",
    #          color='g')

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
    plt.xlim((0, 3000))
    plt.ylim((0, 1))
    # plt.xticks(np.arange(0, len(t)+1, 5))
    # plt.legend()
    plt.xlabel('Time [frames]')
    plt.ylabel("$\phi$", rotation=0, labelpad=15, fontsize=22)
    plt.tight_layout()
    plt.savefig(os.path.join(os.path.dirname(__file__), "figures/result1_sem.svg"), format='svg')


def main():
    plot_data_multi()
    # plt.show()

    return 0


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()
