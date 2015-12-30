#ifndef HISTOGRAMWINDOW_H
#define HISTOGRAMWINDOW_H

#include <QDialog>

namespace Ui {
class HistogramWindow;
}

class HistogramWindow : public QDialog
{
    Q_OBJECT

public:
    explicit HistogramWindow(QWidget *parent = 0, std::string hist_src="histogram.yml");
    ~HistogramWindow();

private:
    Ui::HistogramWindow *ui;
};

#endif // HISTOGRAMWINDOW_H
