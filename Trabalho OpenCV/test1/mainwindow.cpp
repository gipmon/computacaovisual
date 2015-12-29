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

    reloadImageAndHistogram();
}

void MainWindow::reloadImageAndHistogram(){
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
      if(ui->red_hist->isChecked()){
          cv::line( histogram, cv::Point( bin_w*(i-1), hist_h - cvRound(histogram_r.at<float>(i-1)) ) ,
                           cv::Point( bin_w*(i), hist_h - cvRound(histogram_r.at<float>(i)) ),
                           cv::Scalar( 0, 0, 255), 2, 8, 0  );
      }
      if(ui->blue_hist->isChecked()){
          cv::line( histogram, cv::Point( bin_w*(i-1), hist_h - cvRound(histogram_b.at<float>(i-1)) ) ,
                           cv::Point( bin_w*(i), hist_h - cvRound(histogram_b.at<float>(i)) ),
                           cv::Scalar( 255, 0, 0), 2, 8, 0  );
      }
      if(ui->green_hist->isChecked()){
          cv::line( histogram, cv::Point( bin_w*(i-1), hist_h - cvRound(histogram_g.at<float>(i-1)) ) ,
                           cv::Point( bin_w*(i), hist_h - cvRound(histogram_g.at<float>(i)) ),
                           cv::Scalar( 0, 255, 0), 2, 8, 0  );
      }
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
    RGB_slider();
}


void MainWindow::on_horizontalSlider_valueChanged(int value)
{
    RGB_slider();
}

void MainWindow::on_horizontalSlider_2_valueChanged(int value)
{
    RGB_slider();
}

void MainWindow::RGB_slider(){
    photo = photo_original.clone();

    for(int i=0; i<photo.rows; i++){
        for(int j=0; j<photo.cols; j++){
            // BLUE
            int value_b = (int) photo.at<cv::Vec3b>(i, j)[0] + ui->horizontalSlider_2->value();
            if(value_b<0){
                value_b = 0;
            }else if(value_b>255){
                value_b = 255;
            }
            photo.at<cv::Vec3b>(i, j)[0] = value_b;

            // change GREEN
            int value_g = (int) photo.at<cv::Vec3b>(i, j)[1] + ui->horizontalSlider->value();
            if(value_g<0){
                value_g = 0;
            }else if(value_g>255){
                value_g = 255;
            }
            photo.at<cv::Vec3b>(i, j)[1] = value_g;

            // change RED
            int value_r = (int) photo.at<cv::Vec3b>(i, j)[2] + ui->horizontalSlider_3->value();
            if(value_r<0){
                value_r = 0;
            }else if(value_r>255){
                value_r = 255;
            }
            photo.at<cv::Vec3b>(i, j)[2] = value_r;
        }
    }

    reloadImageAndHistogram();
}

void MainWindow::on_pushButton_5_clicked()
{
    // reset rgb
    photo = photo_original.clone();
    reloadImageAndHistogram();
    ui->horizontalSlider->setValue(0);
    ui->horizontalSlider_2->setValue(0);
    ui->horizontalSlider_3->setValue(0);
}

void MainWindow::on_red_hist_clicked()
{
    if(ui->red_hist->isChecked()){
        ui->horizontalSlider_3->setValue(0);
    }else{
        ui->horizontalSlider_3->setValue(-255);
    }
    reloadImageAndHistogram();
}

void MainWindow::on_green_hist_clicked()
{
    if(ui->green_hist->isChecked()){
        ui->horizontalSlider->setValue(0);
    }else{
        ui->horizontalSlider->setValue(-255);
    }
    reloadImageAndHistogram();
}

void MainWindow::on_blue_hist_clicked()
{
    if(ui->blue_hist->isChecked()){
        ui->horizontalSlider_2->setValue(0);
    }else{
        ui->horizontalSlider_2->setValue(-255);
    }
    reloadImageAndHistogram();
}

void MainWindow::on_pushButton_6_clicked()
{
    // http://docs.opencv.org/2.4/doc/tutorials/imgproc/histograms/histogram_equalization/histogram_equalization.html
    // http://stackoverflow.com/questions/14708572/opencv-applying-operations-on-rgb-images-splitmerge

}

void MainWindow::on_pushButton_9_clicked()
{
    // brightness histogram

}
