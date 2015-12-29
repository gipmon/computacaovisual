#-------------------------------------------------
#
# Project created by QtCreator 2015-12-27T04:06:20
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = test1
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp

HEADERS  += mainwindow.h

FORMS    += mainwindow.ui

INCLUDEPATH += "/usr/local/include/"

LIBS += `pkg-config --libs opencv`
