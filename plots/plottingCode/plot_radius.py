import numpy
import matplotlib.pyplot as plt
from main import read_data


Rad = 80
UnitCount = 60
ArenaType = "Periodic - Inf 0.01"

Title = "Vision Radius 4[agent length]  - " + str(UnitCount) + " Agents - " + ArenaType


def plot_data_multi():
    indiv = []
    clusters = []
    extrapolating = []
    ignoring_occ = []

    # read_data("Run Data\\Individuals\\Radius 60\\20", indiv)
    # read_data("Run Data\\Clusters\\Radius 60\\20", clusters)
    # read_data("Run Data\\Extrapolating\\Radius 60\\20", extrapolating)
    # read_data("Run Data\\Ignoring\\Radius 60\\20", ignoring_occ)

    path = r"C:\Users\cokron\Desktop\David Robotics"

    read_data(r"C:\Users\cokron\Desktop\David Robotics\polarization\No occlusions\\"+str(Rad)+" - "+str(UnitCount), indiv)
    read_data(r"C:\Users\cokron\Desktop\David Robotics\polarization\OPI - Clusters\\"+str(Rad)+" - "+str(UnitCount), clusters)
    read_data(r"C:\Users\cokron\Desktop\David Robotics\polarization\Extapolate partially occluded\\"+str(Rad)+" - "+str(UnitCount), extrapolating)
    read_data(r"C:\Users\cokron\Desktop\David Robotics\polarization\ignore partially occluded\\"+str(Rad)+" - "+str(UnitCount), ignoring_occ)


    t = range(len(clusters[0]))

    def mean_arr(array):
        transformed_arr = [*zip(*array)]
        return numpy.asarray([numpy.mean(transformed_arr[i]) for i in t]), \
               numpy.asarray([numpy.std(transformed_arr[i]) for i in t])

    indiv_mean, indiv_std = mean_arr(indiv)
    clusters_mean, clus_std = mean_arr(clusters)
    extrapolating_mean, extra_std = mean_arr(extrapolating)
    ignring_mean, ignor_std = mean_arr(ignoring_occ)

    #std_arr = np.asarray([numpy.std(time_array[i]) for i in t])

    # popt, pcov = curve_fit(func, t, mean_arr)
    # fit_arr = func(t, *popt)
    # popt, pcov = curve_fit(func, xdata, ydata, bounds=(0, [3., 1., 0.5]))

    # plt.fill_between(t,
    #                  mean_arr - 2 * std_arr,
    #                  mean_arr + 2 * std_arr,
    #                  color=(0.2, 0.95, 0.2),
    #                  label="$Mean \pm 2 \cdot STD$",
    #                  alpha=0.1)
    # plt.fill_between(t,
    #                  mean_arr - std_arr,
    #                  mean_arr + std_arr,
    #                  color=(0.3, 0.8, 0.3),
    #                  label="$Mean \pm STD$",
    #                  alpha=0.4)
    # plt.plot(t,
    #          data_mean,
    #          label="10",
    #          color='r')
    plt.fill_between(t,
                     indiv_mean - indiv_std,
                     indiv_mean + indiv_std,
                     color='r',
                     label="$No\;Occlusions \pm STD$",
                     alpha=0.1)
    plt.fill_between(t,
                     extrapolating_mean - extra_std,
                     extrapolating_mean + extra_std,
                     color='b',
                     label="$FOI \pm STD$",
                     alpha=0.1)
    plt.fill_between(t,
                     clusters_mean - clus_std,
                     clusters_mean + clus_std,
                     color='c',
                     label="$OPI \pm STD$",
                     alpha=0.1)
    plt.fill_between(t,
                     ignring_mean - ignor_std,
                     ignring_mean + ignor_std,
                     color='m',
                     label="$AOI \pm STD$",
                     alpha=0.1)
    plt.plot(t,
             indiv_mean,
             label="No Occlusions",
             color='r')
    plt.plot(t,
             clusters_mean,
             label="OPI",
             color='b')
    plt.plot(t,
             extrapolating_mean,
             label="FOI",
             color='c')
    plt.plot(t,
             ignring_mean,
             label="AOI",
             color='m')
    # plt.plot(t,
    #          mean_100,
    #          label="100",
    #          color='y')
    # plt.plot(t,
    #          mean_120,
    #          label="120",
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
    # plt.ylim((0, 1))
    # plt.xticks(np.arange(0, len(t)+1, 5))
    plt.legend()
    plt.xlabel('Time [Frames]')
    plt.ylabel('$\Phi$', rotation=0, fontsize=16)
    # plt.ylabel('Circular Standard Deviation')
    # plt.ylabel('Order Parameter')

def main():
    plot_data_multi()
    plt.title(Title)
    plt.show()

    return 0


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()