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

    Mat imagemCanny_1;

    Canny( imagemOriginal, imagemCanny3x3_X, 1, 255);

    namedWindow( "Canny - 1", CV_WINDOW_AUTOSIZE );

    imshow( "Canny - 1", imagemCanny3x3_X );

    // Scaling para 8 bits

    Mat imagem8Bits;

    convertScaleAbs( imagemCanny3x3_X, imagem8Bits );

    namedWindow( "8 bits - Sobel 3 x 3 - X", CV_WINDOW_AUTOSIZE );

    imshow( "8 bits - Sobel 3 x 3 - X", imagem8Bits );

    // Op. de SOBEL 5 x 5

    Mat imagemSobel5x5_X;

    Sobel( imagemOriginal, imagemSobel5x5_X, CV_16SC1, 1, 0, 5 );

    convertScaleAbs( imagemSobel5x5_X, imagem8Bits );

    namedWindow( "8 bits - Sobel 5 x 5 - X", CV_WINDOW_AUTOSIZE );

    imshow( "8 bits - Sobel 5 x 5 - X", imagem8Bits );


    Mat imagemSobel3x3_Y;

    Sobel( imagemOriginal, imagemSobel3x3_Y, CV_16SC1, 0, 1, 3 );

    // Scaling para 8 bits

    convertScaleAbs( imagemSobel3x3_Y, imagem8Bits );

    namedWindow( "8 bits - Sobel 3 x 3 - Y", CV_WINDOW_AUTOSIZE );

    imshow( "8 bits - Sobel 3 x 3 - Y", imagem8Bits );

    Mat imagemSobel5x5_Y;

    Sobel( imagemOriginal, imagemSobel5x5_Y, CV_16SC1, 0, 1, 5 );

    convertScaleAbs( imagemSobel5x5_Y, imagem8Bits );

    namedWindow( "8 bits - Sobel 5 x 5 - Y", CV_WINDOW_AUTOSIZE );

    imshow( "8 bits - Sobel 5 x 5 - Y", imagem8Bits );

   /* Mat x, y;

    pow(imagemSobel3x3_X, 2, x);
    pow(imagemSobel3x3_Y, 2, x);

    Mat imagemGrad = x + y;

    convertScaleAbs( imagemGrad, imagem8Bits );

    namedWindow( "8 bits - imagemGrad", CV_WINDOW_AUTOSIZE );

    imshow( "8 bits - imagemGrad", imagemGrad );
*/

    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}

