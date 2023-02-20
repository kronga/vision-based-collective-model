import numpy
import matplotlib.pyplot as plt
from main import read_data


frame10_arr = []
frame500_arr = []
frame1000_arr = []
frame1500_arr = []

indi_arr = []
clus_arr = []
extr_arr = []
igno_arr = []

time_frame = 1500



def main():
    # read_data(r"C:\Users\cokron\Desktop\David Robotics\Data\indi_pairs\10", frame10_arr)
    read_data(r"C:\Users\cokron\Desktop\David Robotics\Data\igno_pairs\500", frame500_arr)
    read_data(r"C:\Users\cokron\Desktop\David Robotics\Data\igno_pairs\1000", frame1000_arr)
    read_data(r"C:\Users\cokron\Desktop\David Robotics\Data\igno_pairs\1500", frame1500_arr)

    # x_axis = list(range(0, 250, 3))
    # plt.plot(x_axis, frame10_arr[0], label="10 frames")
    plt.plot( frame500_arr[0], label="500 frames")
    plt.plot( frame1000_arr[0], label="1000 frames")
    plt.plot( frame1500_arr[0], label="1500 frames")

    # plt.plot(x_axis, indi_arr[0], label="indi")
    # plt.plot(x_axis, clus_arr[0], label="clus")
    # plt.plot(x_axis, extr_arr[0], label="extr")
    # plt.plot(x_axis, igno_arr[0], label="igno")
    plt.legend()
    # plt.ylim((-0.1, 0.4))
    plt.xlabel("radius")
    plt.ylabel("pair correlation function")
    plt.title("Pair correlation - " + str(time_frame) + " frames")
    plt.show()

    return 0


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()