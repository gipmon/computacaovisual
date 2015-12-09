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

    // Imprimir alguma informacao

    cout << "IMAGEM ORIGINAL" << endl;

    printImageFeatures( imagemOriginal );

    // binary threshold

    Mat thresholdFMediaBinary;

    threshold( imagemOriginal, thresholdFMediaBinary, 90, 255, THRESH_BINARY_INV );

    namedWindow( "Binary image", CV_WINDOW_AUTOSIZE );

    imshow( "Binrary image", thresholdFMediaBinary );

    // dilate

    Mat dilateImg;

    Mat element11_11 = getStructuringElement(MORPH_ELLIPSE, Size(11, 11));

    erode(thresholdFMediaBinary, dilateImg, element11_11);
    erode(dilateImg, dilateImg, element11_11);

    namedWindow( "erode image", CV_WINDOW_AUTOSIZE );

    imshow( "erode image", dilateImg );

    // Esperar

    waitKey( 0 );

	// Destruir as janelas --- Desnecessario neste programa simples

	destroyAllWindows();

	return 0;
}
