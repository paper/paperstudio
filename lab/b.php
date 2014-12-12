<!DOCTYPE HTML>
<html>
	<head>
		<title>b </title>
	</head>
	<body>
	
<?php 
	function br(){
		echo "<br /><br />";
	};
	
	$t1="Hello world";
	$t2="1234";
	
	//echo $t1.$t2;
	//echo 5/3;
	
	$i=0;
	
	while($i<5){
		echo "The number is ".$i."<br />";
		$i++;
	}
	echo "<br /><br />";
	$j=0;
	do{
		echo "The number is ".$j."<br />";
		$j++;
	}while($j<5);
	
	br();
	
	$arr=array("one","two","three");
	
	foreach($arr as $value){
		echo $value."<br />";
	}
	
?>

		
		
		
		
		
		
		
		
		
		
		
		
	</body>
</html>