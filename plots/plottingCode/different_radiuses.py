import numpy
import matplotlib.pyplot as plt
from main import read_data


def plot_data_multi():
    radius_30 = []
    radius_40 = []
    radius_50 = []
    radius_60 = []
    radius_70 = []
    radius_80 = []
    radius_90 = []
    radius_100 = []
    radius_110 = []
    radius_120 = []
    radius_130 = []
    radius_140 = []
    #
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/30", radius_30)
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/40", radius_40)
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/50", radius_50)
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/60", radius_60)
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/70", radius_70)
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/80", radius_80)
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/90", radius_90)
    # read_data("C:/Users/cokron/Desktop/David Robotics/vision_radius_sensitivity/100", radius_100)


    # read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.01", radius_70)
    # read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.05", radius_80)
    # read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.1", radius_90)
    # read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.15", radius_100)

    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.01", radius_30)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.05", radius_40)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.1", radius_50)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.15", radius_60)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.2", radius_70)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.25", radius_80)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.3", radius_90)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.35", radius_100)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.4", radius_110)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.45", radius_120)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.5", radius_130)
    read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/0.55", radius_140)


    t = range(len(radius_70[0]))

    def mean_arr(array):
        transformed_arr = [*zip(*array)]
        return numpy.asarray([numpy.mean(transformed_arr[i]) for i in t])


    mean30 = mean_arr(radius_30)
    mean40 = mean_arr(radius_40)
    mean50 = mean_arr(radius_50)
    mean60 = mean_arr(radius_60)
    mean70 = mean_arr(radius_70)
    mean80 = mean_arr(radius_80)
    mean90 = mean_arr(radius_90)
    mean100 = mean_arr(radius_100)
    mean110 = mean_arr(radius_110)
    mean120 = mean_arr(radius_120)
    mean130 = mean_arr(radius_130)
    mean140 = mean_arr(radius_140)

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
    plt.plot(t,
             mean30,
             label="i=0.01")
    plt.plot(t,
             mean40,
             label="i=0.05")
    plt.plot(t,
             mean50,
             label="i=0.1")
    plt.plot(t,
             mean60,
             label="i=0.15")
    # plt.plot(t,
    #          mean70,
    #          label="i=0.2")
    # plt.plot(t,
    #          mean80,
    #          label="i=0.25")
    # plt.plot(t,
    #          mean90,
    #          label="i=0.3")
    # plt.plot(t,
    #          mean100,
    #          label="i=0.35")
    # plt.plot(t,
    #          mean110,
    #          label="i=0.4")
    # plt.plot(t,
    #          mean120,
    #          label="i=0.45")
    # plt.plot(t,
    #          mean130,
    #          label="i=0.5")
    # plt.plot(t,
    #          mean140,
    #          label="i=0.55")


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
    plt.legend()
    plt.xlabel('Time [Frames]')
    plt.ylabel('$\Phi$', rotation=0, fontsize=16)


def main():
    plot_data_multi()
    plt.title("Influence sensitivity analysis - Unit count=120, r=80")
    plt.show()

    return 0


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()