#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QMessageBox>
#include <QLabel>
#include <QFileDialog>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <asmopencv.h>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    photo = cv::imread("Fruits-RGB.tif");
    photo_original = cv::imread("Fruits-RGB.tif");

    if(!photo.data){
        QMessageBox msg;
        msg.setText("Could not load image");
        msg.exec();
    }

    QImage imgIn= ASM::cvMatToQImage(photo);
    ui->label->setPixmap(QPixmap::fromImage(imgIn));
    setHistogram();
}

void MainWindow::setHistogram(){
    // make histogram

    /// Separate the image in 3 places ( B, G and R )
    cv::vector<cv::Mat> bgr_planes;
    cv::split( photo, bgr_planes );

    // Establish the number of bins
    int histSize = 256;

    // Set the ranges ( for B,G,R) )
    float range[] = { 0, 256 } ;
    const float* histRange = { range };

    bool uniform = true;
    bool accumulate = false;

    cv::calcHist( &bgr_planes[0], 1, 0, cv::Mat(), histogram_b, 1, &histSize, &histRange, uniform, accumulate );
    cv::calcHist( &bgr_planes[1], 1, 0, cv::Mat(), histogram_g, 1, &histSize, &histRange, uniform, accumulate );
    cv::calcHist( &bgr_planes[2], 1, 0, cv::Mat(), histogram_r, 1, &histSize, &histRange, uniform, accumulate );

    // Draw the histograms for B, G and R
    int hist_w = 350; int hist_h = 350;
    int bin_w = cvRound( (double) hist_w/histSize );

    histogram = cv::Mat( hist_h, hist_w, CV_8UC3, cv::Scalar( 0,0,0) );

    // Normalize the result to [ 0, histogram.rows ]
    cv::normalize(histogram_b, histogram_b, 0, histogram.rows, cv::NORM_MINMAX, -1, cv::Mat() );
    cv::normalize(histogram_g, histogram_g, 0, histogram.rows, cv::NORM_MINMAX, -1, cv::Mat() );
    cv::normalize(histogram_r, histogram_r, 0, histogram.rows, cv::NORM_MINMAX, -1, cv::Mat() );

    /// Draw for each channel
    for( int i = 1; i < histSize; i++ )
    {
      cv::line( histogram, cv::Point( bin_w*(i-1), hist_h - cvRound(histogram_b.at<float>(i-1)) ) ,
                       cv::Point( bin_w*(i), hist_h - cvRound(histogram_b.at<float>(i)) ),
                       cv::Scalar( 255, 0, 0), 2, 8, 0  );
      cv::line( histogram, cv::Point( bin_w*(i-1), hist_h - cvRound(histogram_g.at<float>(i-1)) ) ,
                       cv::Point( bin_w*(i), hist_h - cvRound(histogram_g.at<float>(i)) ),
                       cv::Scalar( 0, 255, 0), 2, 8, 0  );
      cv::line( histogram, cv::Point( bin_w*(i-1), hist_h - cvRound(histogram_r.at<float>(i-1)) ) ,
                       cv::Point( bin_w*(i), hist_h - cvRound(histogram_r.at<float>(i)) ),
                       cv::Scalar( 0, 0, 255), 2, 8, 0  );
    }

    QImage imgHist= ASM::cvMatToQImage(histogram);
    ui->label_2->setPixmap(QPixmap::fromImage(imgHist));
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_3_clicked()
{
    // Save Image
    try{
        QString fileName = QFileDialog::getSaveFileName(this,tr("Save Image"), "", tr("Image Files (*.png *.jpg *.bmp *.tif)"));
        QImage imgIn = ASM::cvMatToQImage(photo);
        imgIn.save(fileName);
    }catch(cv::Exception e){

    }
}

void MainWindow::on_pushButton_4_clicked()
{
    // Load Image
    QString fileName = QFileDialog::getOpenFileName(this,tr("Open Image"), "", tr("Image Files (*.png *.jpg *.bmp *.tif)"));

    photo = cv::imread(fileName.toStdString());
    if(!photo.data){
        QMessageBox msg;
        msg.setText("Could not load image");
        msg.exec();
    }

    QImage imgIn= ASM::cvMatToQImage(photo);
    ui->label->setPixmap(QPixmap::fromImage(imgIn));
    setHistogram();
}

void MainWindow::on_pushButton_clicked()
{
    try{
        // Save Histogram
        QString fileName = QFileDialog::getSaveFileName(this,tr("Save Histogram"), "", tr("Histogram Files (*.yml)"));
        cv::FileStorage fs(fileName.toStdString(), cv::FileStorage::WRITE);
        if (!fs.isOpened()) {
            QMessageBox msg;
            msg.setText("Could not open file storage");
            msg.exec();
        }

        fs << "histogram" << histogram;
        fs.release();
    }catch(cv::Exception e){

    }
}


void MainWindow::on_pushButton_2_clicked()
{
    try{
        // Load Histogram and Image
        QString fileName = QFileDialog::getOpenFileName(this,tr("Open Histogram"), "", tr("Image Files (*.yml)"));
        cv::FileStorage fs(fileName.toStdString(), cv::FileStorage::READ);

        if (!fs.isOpened()) {
            QMessageBox msg;
            msg.setText("Could not load histogram");
            msg.exec();
        }

        fs["histogram"] >> histogram;
        fs.release();

        QImage imgHist= ASM::cvMatToQImage(histogram);
        ui->label_2->setPixmap(QPixmap::fromImage(imgHist));
    }catch(cv::Exception e){

    }
}

void MainWindow::on_horizontalSlider_3_valueChanged(int value)
{

}
