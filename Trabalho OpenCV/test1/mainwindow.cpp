#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QMessageBox>
#include <QLabel>
#include <QFileDialog>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <asmopencv.h>
#include <histogramwindow.h>

MainWindow::MainWindow(QWidget *parent, std::string img_url) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    bool contrast_changed = false;
    bool bright_changed = false;

    ui->setupUi(this);

    photo = cv::imread(img_url);
    photo_original = cv::imread(img_url);

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
    int hist_w = 256; int hist_h = 500;
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

    // allcoate memory for no of pixels for each intensity value
    int histogram_intensity[256];

    // initialize all intensity values to 0
    for(int i = 0; i < 255; i++)
    {
        histogram_intensity[i] = 0;
    }

    // calculate the no of pixels for each intensity values
    for(int y = 0; y < photo.rows; y++)
        for(int x = 0; x < photo.cols; x++)
            histogram_intensity[(int)photo.at<uchar>(y,x)]++;

    // find the maximum intensity element from histogram
    int max = histogram_intensity[0];
    for(int i = 1; i < 256; i++){
        if(max < histogram_intensity[i]){
            max = histogram_intensity[i];
        }
    }

    // normalize the histogram between 0 and histogram.rows

    for(int i = 0; i < 255; i++){
        histogram_intensity[i] = ((double)histogram_intensity[i]/max)*histogram.rows;
    }


    // draw the intensity line for histogram
    for(int i = 0; i < 255; i++)
    {
        if(ui->y_hist->isChecked()){
            cv::line( histogram, cv::Point( bin_w*(i-1), hist_h - cvRound(histogram_intensity[i-1]) ) ,
                             cv::Point( bin_w*(i), hist_h - cvRound(histogram_intensity[i]) ),
                             cv::Scalar( 224, 224,224), 2, 8, 0  );
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

    MainWindow *window = new MainWindow(0, fileName.toStdString());
    window->show();
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
        HistogramWindow *hist = new HistogramWindow(0, fileName.toStdString());
        hist->show();
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

    if(contrast_changed || bright_changed){
        cv::Mat new_image = cv::Mat::zeros( photo.size(), photo.type() );

        int alpha = (3 * ui->brightness->value()) / 100;
        int beta = ui->contrast->value();

        /// Do the operation new_image(i,j) = alpha*image(i,j) + beta
        for( int y = 0; y < photo.rows; y++ ){
             for( int x = 0; x < photo.cols; x++ ){
                 for( int c = 0; c < 3; c++ ){
                    new_image.at<cv::Vec3b>(y,x)[c] = cv::saturate_cast<uchar>( alpha * ( photo.at<cv::Vec3b>(y,x)[c] ) + beta );
                 }
             }
        }

        photo = new_image;
    }
    reloadImageAndHistogram();
}

void MainWindow::on_pushButton_5_clicked()
{
    // reset rgb
    ui->horizontalSlider->setValue(0);
    ui->horizontalSlider_2->setValue(0);
    ui->horizontalSlider_3->setValue(0);
    ui->brightness->setValue(50);
    ui->contrast->setValue(50);
    bright_changed = false;
    contrast_changed = false;
    photo = photo_original.clone();
    reloadImageAndHistogram();
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

void MainWindow::on_y_hist_clicked()
{
    reloadImageAndHistogram();
}

void MainWindow::on_contrast_valueChanged(int value)
{
    contrast_changed = true;
    RGB_slider();
}

void MainWindow::on_brightness_valueChanged(int value)
{
    bright_changed = true;
    RGB_slider();
}

void MainWindow::on_pushButton_7_clicked()
{
    // CLAHE (Contrast Limited Adaptive Histogram Equalization)
    cv::Mat lab_image;
    cv::cvtColor(photo_original.clone(), lab_image, CV_BGR2Lab);

    // Extract the L channel
    std::vector<cv::Mat> lab_planes(3);
    cv::split(lab_image, lab_planes);  // now we have the L image in lab_planes[0]

    // apply the CLAHE algorithm to the L channel
    cv::Ptr<cv::CLAHE> clahe = cv::createCLAHE();
    clahe->setClipLimit(4);
    cv::Mat dst;
    clahe->apply(lab_planes[0], dst);

    // Merge the the color planes back into an Lab image
    dst.copyTo(lab_planes[0]);
    cv::merge(lab_planes, lab_image);

    // convert back to RGB
    cv::Mat image_clahe;
    cv::cvtColor(lab_image, image_clahe, CV_Lab2BGR);

    photo = image_clahe;
    reloadImageAndHistogram();
}

void MainWindow::on_pushButton_6_clicked()
{
    cv::Mat ycrcb;
    cv::cvtColor(photo_original.clone(),ycrcb,CV_BGR2YCrCb);

    cv::vector<cv::Mat> channels;
    cv::split(ycrcb,channels);

    cv::equalizeHist(channels[0], channels[0]);

    cv::merge(channels,ycrcb);
    cv::cvtColor(ycrcb,photo,CV_YCrCb2BGR);

    reloadImageAndHistogram();
}
