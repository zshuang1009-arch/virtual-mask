
import pandas as pd
import sys
import os

try:
    print("Reading Excel file...")
    df = pd.read_excel('数据/社交媒体与体貌焦虑调研_314份样本_真实数据_豆包AI生成.xlsx')
    print(f"Successfully read {len(df)} rows of data!")
    print("\nData preview:")
    print(df.head())
    print("\nData types:")
    print(df.dtypes)
    print("\nDescriptive statistics:")
    print(df.describe())
    
    print("\nSaving as CSV...")
    df.to_csv('数据/社交媒体与体貌焦虑调研_核心数据.csv', index=False, encoding='utf-8-sig')
    print("CSV file created successfully!")
    
    print("\nColumn names:")
    print(df.columns.tolist())
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

