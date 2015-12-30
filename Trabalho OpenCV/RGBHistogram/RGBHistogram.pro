#-------------------------------------------------
#
# Project created by QtCreator 2015-12-27T04:06:20
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = RGBHistogram
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    histogramwindow.cpp

HEADERS  += mainwindow.h \
    asmopencv.h \
    histogramwindow.h

FORMS    += mainwindow.ui \
    histogramwindow.ui

INCLUDEPATH += "/usr/local/include/"

LIBS += `pkg-config --libs opencv`
