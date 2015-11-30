/*
 * OpenCV_ex_14.c
 *
 * FILTRO DE Gaussian
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

    // Filtro de Media 3 x 3

    Mat imagemFGaussian3x3_1;

    GaussianBlur( imagemOriginal, imagemFGaussian3x3_1, Size(3,3), 0 );

    namedWindow( "Filtro de Gaussian 3 x 3 - 1 Iter", CV_WINDOW_AUTOSIZE );

    imshow( "Filtro de Gaussian 3 x 3 - 1 Iter", imagemFGaussian3x3_1 );

    Mat imagemFGaussian3x3_2;

    GaussianBlur( imagemFGaussian3x3_1, imagemFGaussian3x3_2, Size(3,3), 0  );

    namedWindow( "Filtro de Gaussian 3 x 3 - 2 Iter", CV_WINDOW_AUTOSIZE );

    imshow( "Filtro de Gaussian 3 x 3 - 2 Iter", imagemFGaussian3x3_2 );
    // Filtro de Media 5 x 5
     Mat imagemFGaussian5x5_1;

    GaussianBlur( imagemOriginal, imagemFGaussian5x5_1, Size(5,5), 0  );

    namedWindow( "Filtro de Gaussian 5 x 5 - 1 Iter", CV_WINDOW_AUTOSIZE );

    imshow( "Filtro de Gaussian 5 x 5 - 1 Iter", imagemFGaussian5x5_1 );
    // Filtro de Media 7 x 7
     Mat imagemFGaussian7x7_1;

    GaussianBlur( imagemOriginal, imagemFGaussian7x7_1, Size(7,7), 0  );

    namedWindow( "Filtro de Gaussian 7 x 7 - 1 Iter", CV_WINDOW_AUTOSIZE );

    imshow( "Filtro de Gaussian 7 x 7 - 1 Iter", imagemFGaussian7x7_1 );

    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}


