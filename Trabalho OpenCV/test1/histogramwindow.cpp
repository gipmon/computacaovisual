#include "histogramwindow.h"
#include "ui_histogramwindow.h"
#include <QMessageBox>
#include <QLabel>
#include <QFileDialog>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <asmopencv.h>

HistogramWindow::HistogramWindow(QWidget *parent, std::string hist_src) :
    QDialog(parent),
    ui(new Ui::HistogramWindow)
{
    ui->setupUi(this);

    this->setWindowTitle(QString::fromStdString(hist_src));

    cv::FileStorage fs(hist_src, cv::FileStorage::READ);

    if (!fs.isOpened()) {
        QMessageBox msg;
        msg.setText("Could not load histogram");
        msg.exec();
    }

    cv::Mat histogram;

    fs["histogram"] >> histogram;
    fs.release();

    QImage imgHist= ASM::cvMatToQImage(histogram);
    ui->label_2->setPixmap(QPixmap::fromImage(imgHist));
}

HistogramWindow::~HistogramWindow()
{
    delete ui;
}
