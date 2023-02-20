import os
import webbrowser
import time


def main():
    path = os.path.abspath('index.html')
    url = 'file://' + path
    times_run = 10
    ver_url = "file://" + "C:/Users/cokron/Desktop/David Robotics/Configs/ver"

    flag_path = "C:/Users/cokron/Downloads/done.txt"
    for ver_num in range(1, 5, 1):
        for i in range(times_run):
            webbrowser.open(ver_url+str(ver_num)+"/index.html")
            while not os.path.isfile(flag_path):
                time.sleep(2)
            os.remove(flag_path)
            os.system("taskkill /im firefox.exe /f")



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()
