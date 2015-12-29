#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QMessageBox>
#include <QLabel>
#include <QFileDialog>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    original = cv::imread("lena.jpg");
    if(!original.data){
        QMessageBox msg;
        msg.setText("Could not load image");
        msg.exec();
    }
    QImage imgIn= QImage((uchar*) original.data, original.cols, original.rows, original.step, QImage::Format_RGB888);

    ui->label->setPixmap(QPixmap::fromImage(imgIn));
    ui->label_2->setPixmap(QPixmap::fromImage(imgIn));

}

MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::on_horizontalSlider_valueChanged(int value)
{
    int operation = ui->comboBox_2->currentIndex();
    int option = ui->comboBox->currentIndex();
    double factor = (double)value/2;

    cv::Mat element = cv::getStructuringElement( operation,
                                       cv::Size( 2*factor + 1, 2*factor+1 ),
                                       cv::Point( factor, factor ) );


    switch (option) {
        case 0:
            /// Apply the erosion operation
            cv::erode( original, modified, element );
            break;
        case 1:
            /// Apply the dilation operation
            cv::dilate( original, modified, element );
            break;
        case 2:
            /// Apply the opening operation
            cv::morphologyEx( original, modified, option, element );
            break;
        case 3:
            /// Apply the closing operation
            cv::morphologyEx( original, modified, option, element );
            break;
        case 4:
            /// Apply the gradient operation
            cv::morphologyEx( original, modified, option, element );
            break;
        case 5:
            /// Apply the top hat operation
            cv::morphologyEx( original, modified, option, element );
            break;
        case 6:
            /// Apply the black hat operation
            cv::morphologyEx( original, modified, option, element );
            break;
        default:
            break;
        }



    QImage imgIn= QImage((uchar*) modified.data, modified.cols, modified.rows, modified.step, QImage::Format_RGB888);
    ui->label_2->setPixmap(QPixmap::fromImage(imgIn));

}

void MainWindow::on_comboBox_currentIndexChanged(int index)
{
    //original = modified;
    ui->horizontalSlider->setSliderPosition(0);
    QImage imgIn= QImage((uchar*) original.data, original.cols, original.rows, original.step, QImage::Format_RGB888);

    ui->label->setPixmap(QPixmap::fromImage(imgIn));
    ui->label_2->setPixmap(QPixmap::fromImage(imgIn));

}

void MainWindow::on_comboBox_2_currentIndexChanged(int index)
{
    //original = modified;
    ui->horizontalSlider->setSliderPosition(0);
    QImage imgIn= QImage((uchar*) original.data, original.cols, original.rows, original.step, QImage::Format_RGB888);

    ui->label->setPixmap(QPixmap::fromImage(imgIn));
    ui->label_2->setPixmap(QPixmap::fromImage(imgIn));

}

void MainWindow::on_pushButton_clicked()
{
    QImage imgIn= QImage((uchar*) modified.data, modified.cols, modified.rows, modified.step, QImage::Format_RGB888);
    imgIn.save("output.jpg");
}

void MainWindow::on_pushButton_2_clicked()
{
    QString fileName = QFileDialog::getOpenFileName(this,tr("Open Image"), "", tr("Image Files (*.png *.jpg *.bmp)"));

    original = cv::imread(fileName.toStdString());
    if(!original.data){
        QMessageBox msg;
        msg.setText("Could not load image");
        msg.exec();
    }
    QImage imgIn= QImage((uchar*) original.data, original.cols, original.rows, original.step, QImage::Format_RGB888);

    ui->label->setPixmap(QPixmap::fromImage(imgIn));
    ui->label_2->setPixmap(QPixmap::fromImage(imgIn));
}
