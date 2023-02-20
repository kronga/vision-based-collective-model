import numpy
import matplotlib.pyplot as plt
from main import read_data


def plot_circular():
    dataArrays = []
    read_data("circular_no_abs", dataArrays)
    t = range(len(dataArrays[0]))

    def mean_arr(array):
        transformed_arr = [*zip(*array)]
        return numpy.asarray([numpy.mean(transformed_arr[i]) for i in t]), \
               numpy.asarray([numpy.std(transformed_arr[i]) for i in t])

    meanCirc, stdCirc = mean_arr(dataArrays)

    plt.fill_between(t,
                     meanCirc - stdCirc,
                     meanCirc + stdCirc,
                     label="$Mean \pm STD$",
                     alpha=0.1)
    plt.plot(t,
             meanCirc,
             label="Mean")

    ax = plt.gca()
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.xlim((0, 3000))
    # plt.ylim((0, 1))
    # plt.xticks(np.arange(0, len(t)+1, 5))
    plt.legend()
    plt.xlabel('Time [Frames]')
    plt.ylabel('Order Parameter')



def main():
    plot_circular()
    plt.title("Avg. 35 Runs - Circular Arena - No Abs.")
    plt.show()

    return 0


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()