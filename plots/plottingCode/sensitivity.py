import matplotlib.pyplot as plt
import numpy as np
from main import read_data
import os
from enum import IntEnum
from scipy.stats import sem

Time_frame = 3000


class Variant(IntEnum):
    No_occlusions = 1
    Clusters = 2
    Extrapolating = 3
    Ignore = 4


class SensitivityPlots:

    def __init__(self):
        pass

    @staticmethod
    def mean_arr(array):
        t = range(len(array[0]))
        transformed_arr = [*zip(*array)]
        return np.asarray([np.mean(transformed_arr[i]) for i in t]), \
               np.asarray([sem(transformed_arr[i]) for i in t]),

    @staticmethod
    def influence_analysis(time_frame=3000):
        x = []
        y = []
        y_err = []
        x_values = [0.001, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12, 0.15]
        for inf_value in x_values:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/influence _sens/" + str(inf_value), raw_data)
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            x.append(inf_value)
            y.append(mean_array[time_frame])
            y_err.append(std_array[time_frame])
        # save plot
        plt.errorbar(x,
                     y,
                     y_err,
                     ecolor="black",
                     color="blue",
                     capsize=3)
        plt.xlabel("$\\eta$", fontsize=22)
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        plt.ylim((0, 1))
        # plt.legend()
        # plt.title("Time frame: " + str(Time_frame))
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__), "figures/influence_sensitivity_analysis.svg"), format='svg')
        plt.close()

    @staticmethod
    def radius_analysis(time_frame=3000):
        x = []
        y = []
        y_err = []
        x_values = list(range(20, 111, 10))
        for rad_value in x_values:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/radiusSens/" + str(rad_value), raw_data)
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            x.append(rad_value / 20)
            y.append(mean_array[time_frame])
            y_err.append(std_array[time_frame])
        # save plot
        plt.errorbar(x,
                     y,
                     y_err,
                     ecolor="black",
                     color="blue",
                     capsize=3)
        plt.xlabel("$R$ [bl]")
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        plt.ylim((0, max([y[i] + y_err[i] for i in range(len(x))])))
        # plt.legend()
        # plt.title("Time frame: " + str(Time_frame))
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__), "figures/radius_sensitivity_analysis.svg"), format="svg")
        plt.close()

    @staticmethod
    def population_size_analysis(time_frame=3000):
        x = []
        y = []
        y_err = []
        x_values = list(range(20, 201, 20))
        for rad_value in x_values:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/populationSizeSens/" + str(rad_value), raw_data)
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            x.append(rad_value)
            y.append(mean_array[time_frame])
            y_err.append(std_array[time_frame])
        # save plot
        plt.errorbar(x,
                     y,
                     y_err,
                     ecolor="black",
                     color="blue",
                     capsize=3)
        plt.xlabel("N")
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        plt.ylim((0, 1))
        # plt.legend()
        # plt.title("Time frame: " + str(time_frame))
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__), "figures/pop_size_sensitivity_analysis.svg"), format="svg")
        plt.close()

    @staticmethod
    def length_analysis(time_frame=3000):
        x = []
        y = []
        y_err = []
        x_values = list(range(10, 101, 10))
        for length in x_values:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/length_ratio/" + str(length), raw_data)
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            x.append(length)
            y.append(mean_array[time_frame])
            y_err.append(std_array[time_frame])
        # save plot
        plt.errorbar(x,
                     y,
                     y_err,
                     ecolor="black",
                     color="blue",
                     capsize=3)
        plt.xlabel("Agent Length")
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        plt.ylim((0, 1))
        # plt.legend()
        # plt.title("Time frame: " + str(Time_frame))
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__), 'figures/agent_length_sensitivity_analysis.svg'),
                    format='svg', dpi=1200)
        plt.close()

    @staticmethod
    def compare_variants(range_params, with_std, title="fig", path="", _label="ver", blFlag=False):
        x = []
        y = []
        variants = list(range(*range_params))
        for ver_num in variants:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/" + path + str(ver_num), raw_data)
            x = range(len(raw_data[0]))
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            if with_std:
                plt.fill_between(x,
                                 mean_array - std_array,
                                 mean_array + std_array,
                                 label='_nolegend_',
                                 alpha=0.2)
            if blFlag:
                plt.plot(x,
                         mean_array,
                         label=_label + "=" + str(ver_num / 20))
            else:
                plt.plot(x,
                         mean_array,
                         label=_label + "=" + str(ver_num))
        # save plot
        plt.xlabel("Time [frames]")
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        plt.ylim((0, 1))
        plt.xlim((0, 3000))
        plt.legend(frameon=False, fontsize=14)
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__) + "/figures/", title + ".svg"), format='svg', dpi=1200)
        plt.close()

    @staticmethod
    def compare_variants_exact_values(values, with_std, title, path="", param_label="$\eta=$"):
        x = []
        y = []
        variants = values
        for ver_num in variants:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/" + path + str(ver_num), raw_data)
            x = range(len(raw_data[0]))
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            if with_std:
                plt.fill_between(x,
                                 mean_array - std_array,
                                 mean_array + std_array,
                                 label='_nolegend_',
                                 alpha=0.2)
            plt.plot(x,
                     mean_array,
                     label=param_label + str(ver_num))
        # save plot
        plt.xlabel("Time [frames]")
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        plt.legend(frameon=False, fontsize=14)
        plt.xlim((0, 3000))
        plt.ylim((0, 1))
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__) + "/figures/", title + ".svg"), format='svg', dpi=1200)
        plt.close()

    @staticmethod
    def compare_variants_exact_values_correlation(values, with_std, title, path="", param_label="$\eta=$"):
        x = []
        y = []
        variants = values
        for ver_num in variants:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/" + path + str(ver_num), raw_data)
            # x = range(len(raw_data[0]))
            x = np.arange(3, 251, 3)
            x = x / 30
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            if with_std:
                plt.fill_between(x,
                                 mean_array - std_array,
                                 mean_array + std_array,
                                 label='_nolegend_',
                                 alpha=0.2)
            plt.plot(x,
                     mean_array,
                     label="$t=$" + str(ver_num) + " [frames]")
        # save plot
        plt.xlabel("Radius [bl]")
        plt.ylabel("C(r)", rotation=0, labelpad=25, fontsize=22)
        plt.legend(frameon=False, fontsize=14)
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__) + "/figures/", title + ".svg"), format='svg', dpi=1200)
        plt.close()

    @staticmethod
    def compare_occlusion_methods(range_params, with_std, title="fig", path="", path_params=""):
        x = []
        y = []

        def f(x):
            return {
                1: "Principal",
                2: "OMID",
                3: "COMPLID",
                4: "PARTID"
            }[x]

        variants = list(range(*range_params))
        for ver_num in variants:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/" + path + str(ver_num) + path_params, raw_data)
            x = range(len(raw_data[0]))
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            if with_std:
                plt.fill_between(x,
                                 mean_array - std_array,
                                 mean_array + std_array,
                                 label='_nolegend_',
                                 alpha=0.1)
            plt.plot(x,
                     mean_array,
                     label=f(ver_num))
            print(title, "Ver", ver_num, "mean", mean_array[1500], ", error-", std_array[1500], ',')
            print("")
        # save plot
        plt.xlabel("Time [frames]")
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        plt.ylim((0, 1))
        plt.xlim((0, 3000))
        plt.legend(frameon=False, fontsize=14)
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__) + "/figures/", title + ".svg"), format='svg', dpi=1200)
        plt.close()

    @staticmethod
    def compare_pair_correlations(range_params, with_std, title="fig", path="", path_params=""):
        x = []
        y = []

        def f(x):
            return {
                1: "Principal",
                2: "OMID",
                3: "COMPLID",
                4: "PARTID"
            }[x]

        variants = list(range(*range_params))
        for ver_num in variants:
            # calc data
            raw_data = []
            read_data("C:/Users/cokron/Desktop/David Robotics/" + path + str(ver_num) + path_params, raw_data)
            x = range(len(raw_data[0]))
            mean_array, std_array = SensitivityPlots.mean_arr(raw_data)
            if with_std:
                plt.fill_between(x,
                                 mean_array - std_array,
                                 mean_array + std_array,
                                 label='_nolegend_',
                                 alpha=0.1)
            plt.plot(x,
                     mean_array,
                     label=f(ver_num))
        # save plot
        plt.xlabel("Time [frames]")
        plt.ylabel("$\\phi$", rotation=0, labelpad=15, fontsize=22)
        # plt.ylim((0, 1))
        # plt.xlim((0, 3000))
        plt.legend(frameon=False, fontsize=14)
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__) + "/figures/", title + ".svg"), format='svg', dpi=1200)
        plt.close()

    @staticmethod
    def bar_graph_comparison(title="Half-time Group Order_switched_original"):
        exp_name = ['Torus-60', 'Torus-120', 'Torus-180',
                    'Corridor - Wide', 'Corridor - Regular', 'Corridor - Narrow',
                    'Ring - Wide', 'Ring - Regular', 'Ring - Narrow']

        means1 = [0.7451436815589929, 0.8514389589190408, 0.9131295985829604,
                  0.5515456769348871, 0.6892309697843578, 0.8197449784574398,
                  0.6741920313898027, 0.6890808416689075, 0.6192151447098054, ]
        error1 = [0.0319187907330824, 0.020375827882946465, 0.010458026055518113,
                  0.053758089578472605, 0.05856987662978871, 0.04446892610264359,
                  0.06436410204910548, 0.06034084574033241, 0.0870287962098944, ]

        means2 = [0.7332835769635433, 0.8384946278473381, 0.792680459138375,
                  0.5481088024824123,  0.5983073915344264, 0.5320997759136492,
                  0.5838363217058126,  0.6521376383942392, 0.6197362275892723, ]
        error2 = [0.03241901589442199, 0.018612103344364143, 0.03169115208404497,
                  0.0572166794964098,  0.06140139202472175, 0.06156352880772801,
                  0.06570290969063626, 0.06793064761769492, 0.07547190899441121, ]

        means3 = [0.7513704624999176, 0.8254020363768416, 0.8734109470136026,
                  0.6651727682310047,  0.6736135521839444, 0.8420759128208607,
                  0.5799275898820989, 0.7087500957906766, 0.7251479926692099, ]
        error3 = [0.03275445754116081, 0.025493241562357587, 0.016738915425418964,
                  0.05457732758231641,  0.056835698672725456,0.04703137913868543,
                  0.07457278075968818, 0.06723044566572393,  0.07080298186556439,]

        means4 = [0.701373708055579, 0.755568061975792, 0.8144750379708905,
                  0.5578815334502958,  0.5933914466542828, 0.4671194457034124,
                  0.2109883255813069, 0.29901481523814116, 0.34756658896842474, ]
        error4 = [0.03184906119758275, 0.031117831664651138, 0.024385634952585795,
                  0.044913685702897214,  0.05078344894875666, 0.0463486656110512,
                  0.036013129507526234, 0.04570728904677065,  0.052282368218309797,]

        # set width of bar
        barWidth = 0.15
        fig = plt.subplots(figsize=(27, 8))
        br1 = np.arange(len(means1))
        br2 = [x + barWidth for x in br1]
        br3 = [x + barWidth for x in br2]
        br4 = [x + barWidth for x in br3]

        # Make the plot
        plt.bar(br1, means1, color='r', width=barWidth,
                edgecolor='grey', alpha=0.8, label='Principal')
        plt.errorbar(br1, means1, yerr=error1, fmt="none", ecolor='black', capsize=3)

        plt.bar(br2, means2, color='g', width=barWidth,
                edgecolor='grey', alpha=0.8, label='OMID')
        plt.errorbar(br2, means2, yerr=error2, fmt="none", ecolor='black', capsize=3)

        plt.bar(br3, means3, color='b', width=barWidth,
                edgecolor='grey', alpha=0.8, label='COMPLID')
        plt.errorbar(br3, means3, yerr=error3, fmt="none", ecolor='black', capsize=3)

        plt.bar(br4, means4, color='y', width=barWidth,
                edgecolor='grey', alpha=0.8, label='PARTID')
        plt.errorbar(br4, means4, yerr=error4, fmt="none", ecolor='black', capsize=3)

        # Adding Xticks
        plt.xlabel('Experiment type', fontweight='bold', fontsize=22, labelpad=20)
        plt.ylabel('Order parameter', fontweight='bold', fontsize=22, labelpad=20)
        plt.xticks([r + barWidth for r in range(len(means1))],
                   exp_name, fontsize=12)

        plt.legend(frameon=False, fontsize=14)
        plt.savefig(os.path.join(os.path.dirname(__file__) + "/figures/", title + ".svg"), format='svg', dpi=1200)
        plt.close()


if __name__ == '__main__':
    font = {'size': 18}
    plt.rc('font', **font)

    plt.rcParams['axes.prop_cycle'] = plt.cycler(color=['blue', 'orangered', 'magenta', 'lime', 'gold'])

    #
    # SensitivityPlots.influence_analysis(3000)
    # SensitivityPlots.compare_variants_exact_values((0.01, 0.05, 0.1, 0.15), True, "steering_param_time", "influence _sens/")
    # #
    # SensitivityPlots.radius_analysis(3000)
    # #
    # SensitivityPlots.population_size_analysis(3000)
    # #
    # SensitivityPlots.compare_variants((30,101,20),True, "Vision-Radius Comparison2", "vision_radius_sensitivity/", "R", True)
    # # #
    SensitivityPlots.compare_variants((20,201,40), True, "Population_comparison_fixed","populationSizeSens/", "N")

    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Road Arena - Wide_1", "road/wide_770/")
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Road Arena - Regular", "road/regular_570/")
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Road Arena - Narrow_1", "road/narrow_370/")
    # # #
    # # SensitivityPlots.length_analysis(Time_frame)
    # # SensitivityPlots.compare_variants((20,101,20), True, "length_ratio_time", "length_ratio/", "ratio")
    #
    # # # #
    # # # # """Circular Arena"""
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Ring Arena - Regular", "ring/regular/")
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Ring Arena - Wide", "ring/wide/")
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Ring Arena - Narrow", "ring/narrow/")
    #
    # # Torus Arena
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Occlusions60-60_1", "polarization_UpdDec22/", "/60 - 60/")
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Occlusions60-120_1", "polarization_UpdDec22/", "/60 - 120/")
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Occlusions60-180_1", "polarization_UpdDec22/", "/60 - 180/")
    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), True, "Occlusions60-240_1", "polarization_UpdDec22/", "/60 - 240/")

    # SensitivityPlots.compare_pair_correlations((1, 5, 1), True, "Pair_corrs60-60", "PairCorrsTorus_Dec22/60units/")
    # SensitivityPlots.compare_pair_correlations((1, 5, 1), True, "Pair_corrs60-120", "PairCorrsTorus_Dec22/120units/")
    # SensitivityPlots.compare_pair_correlations((1, 5, 1), True, "Pair_corrs60-180", "PairCorrsTorus_Dec22/180units/")

    SensitivityPlots.bar_graph_comparison()

    # SensitivityPlots.compare_occlusion_methods((1, 5, 1), Fals, "Occlusions_60_120", "polarization_copy/")
    # SensitivityPlots.compare_variants_exact_values_correlation((500,1000,2000,3000), False,"Correlation function","indiCorrs/")
