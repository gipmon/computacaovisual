/*
 * OpenCV_ex_4_1.c
 *
 * FILTRO DE MEDIA
 *
 * J. Madeira - Dez/2012
 */


#include <iostream>


#include "opencv2/core/core.hpp"

#include "opencv2/imgproc/imgproc.hpp"

#include "opencv2/highgui/highgui.hpp"


using namespace cv;

using namespace std;


// FUNCOES AUXILIARES

void printImageFeatures( const Mat &imagem )
{
    cout << endl;

    cout << "Numero de linhas : " << imagem.size().height << endl;

    cout << "Numero de colunas : " << imagem.size().width << endl;

    cout << "Numero de canais : " << imagem.channels() << endl;

    cout << "Numero de bytes por pixel : " << imagem.elemSize() << endl;

    cout << endl;
}


// MAIN

int main( int argc, char** argv )
{
    if( argc != 2)
    {
        cout <<"Falta o nome do ficheiro da imagem !!" << endl;

        return -1;
    }

	Mat imagemOriginal;

	imagemOriginal = imread( argv[1], CV_LOAD_IMAGE_UNCHANGED );

	if( ! imagemOriginal.data )
	{
	    // Leitura SEM SUCESSO

	    cout << "Ficheiro nao foi aberto ou localizado !!" << endl;

	    return -1;
	}

	if( imagemOriginal.channels() > 1 )
	{
	    // Converter para 1 so canal !!

	    cvtColor( imagemOriginal, imagemOriginal, CV_BGR2GRAY, 1 );
	}

    // Janela

    namedWindow( "Imagem Original", CV_WINDOW_AUTOSIZE );

    // Visualizar

    imshow( "Imagem Original", imagemOriginal );

    // Imprimir alguma informacao

    cout << "IMAGEM ORIGINAL" << endl;

    printImageFeatures( imagemOriginal );

    // BINARY INV

    Mat imagemBinary;

    threshold( imagemOriginal, imagemBinary, 120, 255, THRESH_BINARY_INV);

    namedWindow( "Binary Image", CV_WINDOW_AUTOSIZE );

    imshow( "Binary Image", imagemBinary );

    //CRIAR ELEMENTO ESTRUTURANTE

    Mat se11_11;

    se11_11 = getStructuringElement(MORPH_RECT, Size(3,3), Point(0,1));

    Mat imagemErode;

    erode(imagemBinary, imagemErode, se11_11);
    erode(imagemErode, imagemErode, se11_11);
    erode(imagemErode, imagemErode, se11_11);
    erode(imagemErode, imagemErode, se11_11);
    erode(imagemErode, imagemErode, se11_11);
    erode(imagemErode, imagemErode, se11_11);
    erode(imagemErode, imagemErode, se11_11);



    namedWindow( "Erode Image", CV_WINDOW_AUTOSIZE );

    imshow( "Erode Image", imagemErode );

    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}
