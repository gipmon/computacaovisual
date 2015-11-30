/*
 * OpenCV_ex_16.c
 *
 * OPERADOR DE SOBEL
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

    // Op. de SOBEL 3 x 3

    Mat imagemSobel3x3_X;

    Sobel( imagemOriginal, imagemSobel3x3_X, CV_16SC1, 1, 0, 3 );

    namedWindow( "Sobel 3 x 3 - X", CV_WINDOW_AUTOSIZE );

    imshow( "Sobel 3 x 3 - X", imagemSobel3x3_X );

    // Scaling para 8 bits

    Mat imagem8Bits;

    convertScaleAbs( imagemSobel3x3_X, imagem8Bits );

    namedWindow( "8 bits - Sobel 3 x 3 - X", CV_WINDOW_AUTOSIZE );

    imshow( "8 bits - Sobel 3 x 3 - X", imagem8Bits );

    Mat imagemSobel3x3_Y;

    Sobel( imagemOriginal, imagemSobel3x3_Y, CV_16SC1, 0, 1, 3 );

    // Scaling para 8 bits

    convertScaleAbs( imagemSobel3x3_Y, imagem8Bits );

    namedWindow( "8 bits - Sobel 3 x 3 - Y", CV_WINDOW_AUTOSIZE );

    imshow( "8 bits - Sobel 3 x 3 - Y", imagem8Bits );

    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}
