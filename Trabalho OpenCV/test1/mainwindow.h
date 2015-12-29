#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QLabel>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

private slots:

    void on_pushButton_3_clicked();

    void on_pushButton_4_clicked();

    void on_pushButton_clicked();

    void on_pushButton_2_clicked();

    void on_horizontalSlider_3_valueChanged(int value);

private:
    Ui::MainWindow *ui;
    cv::Mat photo;
    cv::Mat photo_original;
    cv::Mat histogram_r;
    cv::Mat histogram_g;
    cv::Mat histogram_b;
    cv::Mat histogram;
    void setHistogram();
};

#endif // MAINWINDOW_H
